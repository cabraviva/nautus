use anyhow::Result;
use crossterm::{
    event::{self, Event, KeyCode, KeyEvent},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    layout::{Alignment, Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, List, ListItem, Paragraph},
    Terminal,
};
use std::io;

pub struct TuiApp {
    pub selected: usize,
    pub items: Vec<String>,
}

impl TuiApp {
    pub fn new() -> Self {
        Self {
            selected: 0,
            items: vec![
                "Create Project".to_string(),
                "Run Project".to_string(),
                "Build Project".to_string(),
                "Test Project".to_string(),
                "Release Project".to_string(),
                "API Testing".to_string(),
                "Manage Tanks".to_string(),
                "Manage Agents".to_string(),
                "Help".to_string(),
                "Exit".to_string(),
            ],
        }
    }

    pub fn next(&mut self) {
        self.selected = (self.selected + 1) % self.items.len();
    }

    pub fn previous(&mut self) {
        if self.selected > 0 {
            self.selected -= 1;
        } else {
            self.selected = self.items.len() - 1;
        }
    }

    pub fn get_selected(&self) -> &str {
        &self.items[self.selected]
    }
}

pub async fn run_tui() -> Result<()> {
    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let mut app = TuiApp::new();
    let result = run_app(&mut terminal, &mut app).await;

    // Restore terminal
    disable_raw_mode()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
    terminal.show_cursor()?;

    result
}

async fn run_app<B: ratatui::backend::Backend>(
    terminal: &mut Terminal<B>,
    app: &mut TuiApp,
) -> Result<()> {
    loop {
        terminal.draw(|f| {
            let size = f.area();

            // Create layout
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .margin(2)
                .constraints([
                    Constraint::Length(3),
                    Constraint::Min(0),
                    Constraint::Length(3),
                ])
                .split(size);

            // Title
            let title = Paragraph::new("🪸 Nautus - Rust Edition")
                .style(Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD))
                .alignment(Alignment::Center)
                .block(Block::default().borders(Borders::ALL));
            f.render_widget(title, chunks[0]);

            // Menu items
            let items: Vec<ListItem> = app
                .items
                .iter()
                .enumerate()
                .map(|(i, item)| {
                    let content = if i == app.selected {
                        Line::from(vec![
                            Span::styled("▶ ", Style::default().fg(Color::Yellow)),
                            Span::styled(item, Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD)),
                        ])
                    } else {
                        Line::from(vec![
                            Span::raw("  "),
                            Span::raw(item),
                        ])
                    };
                    ListItem::new(content)
                })
                .collect();

            let list = List::new(items)
                .block(Block::default().borders(Borders::ALL).title("Main Menu"));
            f.render_widget(list, chunks[1]);

            // Footer
            let footer = Paragraph::new("↑/↓: Navigate | Enter: Select | q: Quit")
                .style(Style::default().fg(Color::DarkGray))
                .alignment(Alignment::Center)
                .block(Block::default().borders(Borders::ALL));
            f.render_widget(footer, chunks[2]);
        })?;

        // Handle input
        if event::poll(std::time::Duration::from_millis(100))? {
            if let Event::Key(key) = event::read()? {
                match key.code {
                    KeyCode::Char('q') => return Ok(()),
                    KeyCode::Down | KeyCode::Char('j') => app.next(),
                    KeyCode::Up | KeyCode::Char('k') => app.previous(),
                    KeyCode::Enter => {
                        let selected = app.get_selected().to_string();
                        if selected == "Exit" {
                            return Ok(());
                        }
                        // Handle other selections
                        // For now, just return and let the main CLI handle it
                        return Ok(());
                    }
                    _ => {}
                }
            }
        }
    }
}
