use anyhow::{Context, Result};
use deno_core::{JsRuntime, RuntimeOptions};
use std::path::PathBuf;
use std::process::{Command, Stdio};
use tokio::fs;

pub struct JsExecutor {
    runtime: JsRuntime,
}

impl JsExecutor {
    pub fn new() -> Self {
        let runtime = JsRuntime::new(RuntimeOptions::default());
        Self { runtime }
    }

    pub async fn execute_script(&mut self, script_name: &str, is_agent: bool) -> Result<()> {
        let script_path = if is_agent {
            PathBuf::from(format!("./nautus/agents/@{}.js", script_name))
        } else {
            PathBuf::from(format!("./nautus/scripts/@{}.js", script_name))
        };

        if !script_path.exists() {
            anyhow::bail!("Script not found: {:?}", script_path);
        }

        let script_content = fs::read_to_string(&script_path)
            .await
            .context("Failed to read script")?;

        // Prepare the script with nautus API
        let wrapped_script = self.wrap_script(&script_content)?;

        // Execute the script
        self.runtime
            .execute_script("<nautus>", wrapped_script)
            .context("Failed to execute script")?;

        // Run event loop
        self.runtime.run_event_loop(Default::default()).await?;

        Ok(())
    }

    fn wrap_script(&self, script_content: &str) -> Result<String> {
        let wrapper = format!(
            r#"
(async function() {{
    // Define nautus API
    const cmd = async (command) => {{
        // Execute shell command
        return new Promise((resolve, reject) => {{
            // This would need proper implementation with ops
            // For now, return mock
            resolve([0, ""]);
        }});
    }};

    const os = () => {{
        const platform = Deno.build.os;
        if (platform === 'darwin') return 'mac';
        if (platform === 'windows') return 'windows';
        if (platform === 'linux') return 'linux';
        return 'unknown';
    }};

    const info = (...args) => {{
        console.log(...args);
    }};

    const warn = (...args) => {{
        console.warn(...args);
    }};

    const error = (...args) => {{
        console.error('Error:');
        console.error(...args);
        Deno.exit(1);
    }};

    const exit = (code) => {{
        Deno.exit(code || 0);
    }};

    const spawn = async (command, args = [], silent = false) => {{
        // Implementation for spawn
        return 0;
    }};

    const nodeBin = async (command, args = [], silent = false) => {{
        // Implementation for nodeBin
        return 0;
    }};

    const modules = {{
        chalk: {{}}, // Mock chalk
        fse: {{}},   // Mock fs-extra
        fs: {{}},    // Mock fs
        path: {{}},  // Mock path
        axios: {{}}  // Mock axios
    }};

    // Load the actual script
    const scriptFunc = {script_content};
    
    // Execute it
    await scriptFunc(cmd, os, info, warn, error, exit, async (name) => {{
        // Mock runScript
    }}, spawn, modules, nodeBin);
}})();
"#,
            script_content = script_content
        );

        Ok(wrapper)
    }
}

/// Simple script executor using Node.js
pub async fn execute_nautus_script(script_name: &str, is_agent: bool) -> Result<()> {
    let script_path = if is_agent {
        PathBuf::from(format!("./nautus/agents/@{}.js", script_name))
    } else {
        PathBuf::from(format!("./nautus/scripts/@{}.js", script_name))
    };

    if !script_path.exists() {
        anyhow::bail!("Script not found: {:?}", script_path);
    }

    // Get the path to the executor script
    let executor_path = std::env::current_exe()
        .context("Failed to get current exe path")?
        .parent()
        .ok_or_else(|| anyhow::anyhow!("Failed to get exe parent dir"))?
        .join("../../../src/nautus_executor.js");

    // If executor doesn't exist in dev path, try installed path
    let executor_path = if executor_path.exists() {
        executor_path
    } else {
        // Try to find it relative to the binary
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("src/nautus_executor.js")
    };

    if !executor_path.exists() {
        anyhow::bail!("Executor script not found at: {:?}", executor_path);
    }

    // Use Node.js to execute scripts via our executor
    let status = Command::new("node")
        .arg(&executor_path)
        .arg(&script_path)
        .arg(if is_agent { "true" } else { "false" })
        .stdin(Stdio::inherit())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .status()
        .context("Failed to execute script with node")?;

    if !status.success() {
        anyhow::bail!("Script failed with exit code: {:?}", status.code());
    }

    Ok(())
}

/// Helper to execute shell commands from scripts
pub async fn execute_command(command: &str) -> Result<(i32, String)> {
    let output = if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(&["/C", command])
            .output()
            .context("Failed to execute command")?
    } else {
        Command::new("sh")
            .args(&["-c", command])
            .output()
            .context("Failed to execute command")?
    };

    let exit_code = output.status.code().unwrap_or(1);
    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    let combined = format!("{}{}", stdout, stderr);

    Ok((exit_code, combined))
}
