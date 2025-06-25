// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use dotenvy::dotenv;
use sqlx::postgres::PgPoolOptions;
use std::env;

mod ihyaa;
mod models;
mod students;
mod ihyaadays;
mod hodorashoura;
use crate::ihyaa::{delete_ihyaa, get_ihyaat, insert_ihyaa, get_ihyaa_by_id};
use crate::students::{get_students, insert_student, import_students, delete_all_students_and_restore_sequence, edit_student, delete_student};
use crate::ihyaadays::{get_ihyaa_days, finish_ihyaa_day, get_ihyaa_day_by_id};
use crate::hodorashoura::{get_hodor_ashoura_by_day_id, add_hodor_ashoura};

#[tokio::main]
async fn main() {
    dotenv().ok();
    let database_url = "postgres://postgres:password@localhost:5432/fojprogram";
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to PostgreSQL");

    tauri::Builder::default()
        .manage(pool)
        .invoke_handler(tauri::generate_handler![
            get_students,
            insert_student,
            import_students,
            edit_student,
            delete_student,
            delete_all_students_and_restore_sequence,
            get_ihyaat,
            get_ihyaa_by_id,
            insert_ihyaa,
            delete_ihyaa,
            get_ihyaa_days,
            finish_ihyaa_day,
            get_hodor_ashoura_by_day_id,
            add_hodor_ashoura,
            get_ihyaa_day_by_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
