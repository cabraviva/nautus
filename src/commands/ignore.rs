use anyhow::Result;
use colored::Colorize;

pub async fn execute(path: &str, providers: &[String]) -> Result<()> {
    println!("{}", format!("Adding '{}' to ignore files: {:?}", path, providers).cyan());
    println!("{}", "Ignore feature is not yet fully implemented in the Rust version.".yellow());
    Ok(())
}
