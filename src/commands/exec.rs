use anyhow::{Context, Result};
use colored::Colorize;
use crate::utils;
use crate::js_executor;

pub async fn execute(script: &str) -> Result<()> {
    if !utils::is_project_initialized() {
        println!("{}", "This command requires a nautus project. Initialize it using nautus create!".red());
        return Ok(());
    }

    println!("{}", format!("Executing script: @{}.js", script).cyan());
    js_executor::execute_nautus_script(script, false)
        .await
        .context("Failed to execute script")?;

    Ok(())
}
