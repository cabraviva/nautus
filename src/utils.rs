use anyhow::{Context, Result};
use std::path::PathBuf;
use std::env;

pub fn is_project_initialized() -> bool {
    PathBuf::from("./nautus/.internal/project.json").exists()
}

pub fn get_project_root() -> Result<PathBuf> {
    Ok(env::current_dir().context("Failed to get current directory")?)
}

pub fn get_nautus_dir() -> Result<PathBuf> {
    Ok(get_project_root()?.join("nautus"))
}

pub fn get_scripts_dir() -> Result<PathBuf> {
    Ok(get_nautus_dir()?.join("scripts"))
}

pub fn get_agents_dir() -> Result<PathBuf> {
    Ok(get_nautus_dir()?.join("agents"))
}

pub fn get_internal_dir() -> Result<PathBuf> {
    Ok(get_nautus_dir()?.join(".internal"))
}
