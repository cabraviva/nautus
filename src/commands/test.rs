use anyhow::{Context, Result};
use colored::Colorize;
use crate::utils;
use crate::js_executor;

pub async fn execute() -> Result<()> {
    if !utils::is_project_initialized() {
        println!("{}", "This command requires a nautus project. Initialize it using nautus create!".red());
        return Ok(());
    }

    println!("{}", "Testing project...".cyan());
    js_executor::execute_nautus_script("Test", false)
        .await
        .context("Test script failed")?;

    Ok(())
}

pub fn show_help() {
    println!("This command will test your code.");
    println!("To define how to test your code, please edit {}", "./nautus/scripts/@Test.js".cyan());
}
