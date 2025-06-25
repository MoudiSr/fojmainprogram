use crate::models::{Ihyaa};
use sqlx::PgPool;
use tauri::State;

#[tauri::command]
pub async fn get_ihyaat(pool: State<'_, PgPool>) -> Result<Vec<Ihyaa>, String> {
    let ihyaat = sqlx::query_as::<_, Ihyaa>("SELECT * FROM ihyaa ORDER BY id DESC")
        .fetch_all(&*pool)
        .await
        .map_err(|e| e.to_string())?;
    Ok(ihyaat)
}

#[tauri::command]
pub async fn get_ihyaa_by_id(pool: State<'_, PgPool>, id: i64) -> Result<Ihyaa, String> {
    let ihyaa = sqlx::query_as::<_, Ihyaa>("SELECT * FROM ihyaa WHERE id = $1")
        .bind(id)
        .fetch_one(&*pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(ihyaa)
}

#[tauri::command]
pub async fn insert_ihyaa(
    pool: State<'_, PgPool>,
    year_georgian: i64,
    year_hijri: i64,
) -> Result<Ihyaa, String> {
    let ihyaa = sqlx::query_as::<_, Ihyaa>(
        "INSERT INTO ihyaa (year_georgian, year_hijri) VALUES ($1, $2) RETURNING *",
    )
    .bind(year_georgian)
    .bind(year_hijri)
    .fetch_one(&*pool)
    .await
    .map_err(|e| e.to_string())?;

    for day_num in 1..=13 {
        sqlx::query(
            "INSERT INTO ihyaa_days (ihyaa_id, day, is_done) VALUES ($1, $2, $3)",
        )
        .bind(ihyaa.id)
        .bind(day_num.to_string())
        .bind(false)
        .execute(&*pool)
        .await
        .map_err(|e| format!("Failed to insert day {}: {}", day_num, e))?;
    }
    
    Ok(ihyaa)
}

#[tauri::command]
pub async fn delete_ihyaa(
    pool: State<'_, PgPool>,
    id: i64,
) -> Result<(), String> {
    sqlx::query("DELETE FROM ihyaa WHERE id = $1")
        .bind(id)
        .execute(&*pool)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(())
}