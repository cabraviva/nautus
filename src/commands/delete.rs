use anyhow::Result;
use colored::Colorize;
use std::fs;

pub async fn execute() -> Result<()> {
    if !std::path::PathBuf::from("./nautus").exists() {
        println!("{}", "No nautus project found in this directory!".yellow());
        return Ok(());
    }

    println!("{}", "Are you sure you want to delete the nautus project? (y/n)".yellow());
    let mut input = String::new();
    std::io::stdin().read_line(&mut input)?;

    if input.trim().to_lowercase() == "y" {
        fs::remove_dir_all("./nautus")?;
        println!("{}", "✓ Nautus project deleted!".green());
    } else {
        println!("{}", "Cancelled.".cyan());
    }

    Ok(())
}
