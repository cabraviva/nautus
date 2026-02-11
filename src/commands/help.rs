use colored::Colorize;

pub fn execute() {
    println!("\n{}", "Nautus Commands".cyan().bold());
    println!("{}", "================".cyan());
    println!();
    
    let commands = vec![
        ("create", "Initialize a new nautus project"),
        ("delete", "Delete nautus project"),
        ("run", "Runs your code"),
        ("exec <script>", "Execute a specific script"),
        ("build", "Build your code"),
        ("test", "Test your code"),
        ("release <type>", "Release your code (major, minor, or patch)"),
        ("tank <name> <cmd>", "Manage tanks (code organization)"),
        ("agent <action> <name>", "Manage agents (background watchers)"),
        ("kelp [generator]", "Generate boilerplate with kelp"),
        ("use <framework>", "Use a kelp generator on existing project"),
        ("api", "API testing CLI"),
        ("backup", "Create a backup"),
        ("changelog", "Generate changelog"),
        ("docs", "Generate documentation"),
        ("help", "Show this help"),
        ("hook <action>", "Manage git hooks"),
        ("ignore <path> <providers>", "Add to ignore files"),
        ("license", "Generate license"),
        ("lint", "Lint your code"),
        ("me", "Set user information"),
    ];
    
    for (cmd, desc) in commands {
        println!("  {:30} {}", cmd.green(), desc);
    }
    
    println!();
    println!("For more information on a command, use: {} <command> --help", "nautus".cyan());
    println!();
}
