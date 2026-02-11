use anyhow::{Context, Result};
use colored::Colorize;
use crate::utils;
use crate::js_executor;

pub async fn execute() -> Result<()> {
    if !utils::is_project_initialized() {
        println!("{}", "This command requires a nautus project. Initialize it using nautus create!".red());
        return Ok(());
    }

    println!("{}", "Building project...".cyan());
    js_executor::execute_nautus_script("Build", false)
        .await
        .context("Build script failed")?;

    Ok(())
}

pub fn show_help() {
    println!("This command will build your code.");
    println!("To define how to build your code, please edit {}", "./nautus/scripts/@Build.js".cyan());
}
