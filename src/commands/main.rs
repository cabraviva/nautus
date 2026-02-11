use anyhow::Result;
use colored::Colorize;

pub async fn execute() -> Result<()> {
    println!("{}", "Welcome to Nautus!".cyan().bold());
    println!();
    println!("Nautus is your one & only ultimate software development tool 🪸");
    println!();
    println!("Use {} to see all available commands.", "nautus help".green());
    println!();
    
    Ok(())
}
