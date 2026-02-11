use anyhow::Result;
use colored::Colorize;
use std::fs;
use std::path::PathBuf;
use serde_json::json;

pub async fn execute() -> Result<()> {
    let nautus_dir = PathBuf::from("./nautus");
    
    if nautus_dir.exists() {
        println!("{}", "A nautus project already exists in this directory!".yellow());
        return Ok(());
    }

    println!("{}", "Creating nautus project...".cyan());

    // Create directory structure
    fs::create_dir_all(nautus_dir.join(".internal"))?;
    fs::create_dir_all(nautus_dir.join("scripts"))?;
    fs::create_dir_all(nautus_dir.join("agents"))?;
    fs::create_dir_all(nautus_dir.join("backups"))?;
    fs::create_dir_all(nautus_dir.join("refactor"))?;

    // Create project.json
    let project_json = json!({
        "name": "nautus-project",
        "version": "1.0.0",
        "created": chrono::Utc::now().to_rfc3339()
    });
    fs::write(
        nautus_dir.join(".internal/project.json"),
        serde_json::to_string_pretty(&project_json)?
    )?;

    // Create tanks.json
    let tanks_json = json!([
        {
            "id": "main",
            "paths": {
                "include": ["**/*"],
                "exclude": ["node_modules/**", "nautus/**", ".git/**"]
            },
            "protected": true
        }
    ]);
    fs::write(
        nautus_dir.join(".internal/tanks.json"),
        serde_json::to_string_pretty(&tanks_json)?
    )?;

    // Create hook-rules.json
    let hook_rules_json = json!({});
    fs::write(
        nautus_dir.join(".internal/hook-rules.json"),
        serde_json::to_string_pretty(&hook_rules_json)?
    )?;

    // Create default scripts
    create_default_script(nautus_dir.join("scripts/@Prep.js"), "Prep")?;
    create_default_script(nautus_dir.join("scripts/@Run.js"), "Run")?;
    create_default_script(nautus_dir.join("scripts/@Cleanup.js"), "Cleanup")?;
    create_default_script(nautus_dir.join("scripts/@Build.js"), "Build")?;
    create_default_script(nautus_dir.join("scripts/@Test.js"), "Test")?;
    create_default_script(nautus_dir.join("scripts/@Release.js"), "Release")?;

    // Create agents.yaml
    let agents_yaml = "# Define your agents here\n# Example:\n# - agent: DefaultAgent\n#   tank: main\n";
    fs::write(nautus_dir.join("agents/agents.yaml"), agents_yaml)?;

    // Create default agent
    let default_agent = r#"module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {
    // This agent runs on file changes in the main tank
    info('Agent triggered!')
}
"#;
    fs::write(nautus_dir.join("agents/@DefaultAgent.js"), default_agent)?;

    println!("{}", "✓ Nautus project created successfully!".green());
    println!();
    println!("Next steps:");
    println!("  1. Edit scripts in {}", "./nautus/scripts/".cyan());
    println!("  2. Run your project with {}", "nautus run".green());
    println!();

    Ok(())
}

fn create_default_script(path: PathBuf, name: &str) -> Result<()> {
    let content = format!(
        r#"module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {{
    // {} script
    // Add your logic here
    info('Running {} script...')
    
    // Example: Run a command
    // const [code, output] = await cmd('echo "Hello from {}"')
    // info(output)
}}
"#,
        name, name, name
    );
    fs::write(path, content)?;
    Ok(())
}
