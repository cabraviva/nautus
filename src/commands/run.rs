use anyhow::{Context, Result};
use colored::Colorize;
use crate::utils;
use crate::js_executor;

pub async fn execute() -> Result<()> {
    if !utils::is_project_initialized() {
        println!("{}", "This command requires a nautus project. Initialize it using nautus create!".red());
        return Ok(());
    }

    pub fn show_help() {
        println!("This command will run your code.");
        println!("To define how to run your code, please edit {}", "./nautus/scripts/@Run.js".cyan());
    }

    // Execute Prep script
    println!("{}", "Running @Prep script...".cyan());
    if let Err(e) = js_executor::execute_nautus_script("Prep", false).await {
        eprintln!("{}", format!("Warning: Prep script failed: {}", e).yellow());
    }

    // TODO: Run all agents
    
    // Execute Run script
    println!("{}", "Running @Run script...".cyan());
    let run_result = js_executor::execute_nautus_script("Run", false).await;

    // Execute Cleanup script
    println!("{}", "Running @Cleanup script...".cyan());
    if let Err(e) = js_executor::execute_nautus_script("Cleanup", false).await {
        eprintln!("{}", format!("Warning: Cleanup script failed: {}", e).yellow());
    }

    run_result.context("Run script failed")?;

    Ok(())
}

pub fn show_help() {
    println!("This command will run your code.");
    println!("To define how to run your code, please edit {}", "./nautus/scripts/@Run.js".cyan());
}
