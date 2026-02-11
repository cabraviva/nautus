use anyhow::Result;
use clap::{Parser, Subcommand};

mod commands;
mod js_executor;
mod utils;

#[derive(Parser)]
#[command(name = "nautus")]
#[command(version = "1.6.3")]
#[command(about = "Your one & only ultimate software development tool 🪸", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Initialize a new nautus project
    Create,
    
    /// Delete nautus project
    Delete,
    
    /// Run your code
    Run,
    
    /// Execute a specific script
    Exec {
        /// Script name to execute
        script: String,
    },
    
    /// Build your code
    Build,
    
    /// Test your code
    Test,
    
    /// Release your code (major, minor, or patch)
    Release {
        /// Version type: major, minor, or patch
        version_type: String,
    },
    
    /// Manage tanks (code organization)
    Tank {
        /// Tank name
        tank_name: Option<String>,
        /// Tank command
        command: Option<String>,
        /// Additional arguments
        args: Vec<String>,
    },
    
    /// Manage agents (background watchers)
    Agent {
        /// Action: create or run
        action: String,
        /// Agent name
        name: String,
    },
    
    /// Generate boilerplate with kelp
    Kelp {
        /// Generator name
        generator: Option<String>,
    },
    
    /// Use a kelp generator on existing project
    Use {
        /// Framework name
        framework: String,
    },
    
    /// API testing CLI
    Api,
    
    /// Create a backup
    Backup,
    
    /// Generate changelog
    Changelog {
        user: String,
        repo: String,
        token: String,
        output: String,
        tag: String,
        since: Option<String>,
    },
    
    /// Generate documentation
    Docs,
    
    /// Manage git hooks
    Hook {
        /// Action: init or manager
        action: String,
    },
    
    /// Add to ignore files
    Ignore {
        /// Path to ignore
        path: String,
        /// Providers (git, npm, etc.)
        providers: Vec<String>,
    },
    
    /// Generate license
    License,
    
    /// Lint your code
    Lint {
        #[arg(long)]
        fix: bool,
    },
    
    /// Set user information
    Me {
        #[arg(long)]
        local: bool,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();
    
    // Check for version updates
    check_for_updates().await;
    
    match cli.command {
        Some(Commands::Create) => commands::create::execute().await,
        Some(Commands::Delete) => commands::delete::execute().await,
        Some(Commands::Run) => commands::run::execute().await,
        Some(Commands::Exec { script }) => commands::exec::execute(&script).await,
        Some(Commands::Build) => commands::build::execute().await,
        Some(Commands::Test) => commands::test::execute().await,
        Some(Commands::Release { version_type }) => {
            commands::release::execute(&version_type).await
        },
        Some(Commands::Tank { tank_name, command, args }) => {
            commands::tank::execute(tank_name, command, args).await
        },
        Some(Commands::Agent { action, name }) => {
            commands::agent::execute(&action, &name).await
        },
        Some(Commands::Kelp { generator }) => {
            commands::kelp::execute(generator).await
        },
        Some(Commands::Use { framework }) => {
            commands::use_cmd::execute(&framework).await
        },
        Some(Commands::Api) => commands::api::execute().await,
        Some(Commands::Backup) => commands::backup::execute().await,
        Some(Commands::Changelog { user, repo, token, output, tag, since }) => {
            commands::changelog::execute(&user, &repo, &token, &output, &tag, since.as_deref()).await
        },
        Some(Commands::Docs) => commands::docs::execute().await,
        Some(Commands::Hook { action }) => {
            commands::hook::execute(&action).await
        },
        Some(Commands::Ignore { path, providers }) => {
            commands::ignore::execute(&path, &providers).await
        },
        Some(Commands::License) => commands::license::execute().await,
        Some(Commands::Lint { fix }) => {
            commands::lint::execute(fix).await
        },
        Some(Commands::Me { local }) => {
            commands::me::execute(local).await
        },
        None => {
            // Default to main command (interactive menu or help)
            commands::main::execute().await
        },
    }
}

async fn check_for_updates() {
    if let Ok(response) = reqwest::get("https://registry.npmjs.org/nautus").await {
        if let Ok(data) = response.json::<serde_json::Value>().await {
            if let Some(latest) = data["dist-tags"]["latest"].as_str() {
                if latest > "1.6.3" {
                    println!("{}", colored::Colorize::yellow("[INFO] A newer version of nautus is available! Use cargo install nautus to update!"));
                }
            }
        }
    }
}
