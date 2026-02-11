use anyhow::Result;
use colored::Colorize;

pub async fn execute(local: bool) -> Result<()> {
    println!("{}", "Setting user information...".cyan());
    if local {
        println!("{}", "Saving locally to current project".cyan());
    } else {
        println!("{}", "Saving globally".cyan());
    }
    println!("{}", "Me feature is not yet fully implemented in the Rust version.".yellow());
    Ok(())
}
