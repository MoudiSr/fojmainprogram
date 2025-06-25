use crate::models::{IhyaaDay, Ihyaa};
use sqlx::PgPool;
use tauri::State;

#[tauri::command]
pub async fn get_ihyaa_days(
    pool: State<'_, PgPool>,
    ihyaa_id: i64,
) -> Result<Vec<IhyaaDay>, String> {
    let rows = sqlx::query!(
        r#"
        SELECT 
            d.id as d_id,
            d.day as d_day,
            d.is_done as d_is_done,
            i.id as i_id,
            i.year_georgian,
            i.year_hijri
        FROM ihyaa_days d
        JOIN ihyaa i ON d.ihyaa_id = i.id
        WHERE d.ihyaa_id = $1
        ORDER BY d.day
        "#,
        ihyaa_id
    )
    .fetch_all(&*pool)
    .await
    .map_err(|e| e.to_string())?;

    let ihyaa_days = rows
        .into_iter()
        .map(|row| IhyaaDay {
            id: row.d_id,
            day: row.d_day,
            is_done: row.d_is_done,
            ihyaa: Ihyaa {
                id: row.i_id,
                year_georgian: row.year_georgian,
                year_hijri: row.year_hijri,
            },
        })
        .collect();

    Ok(ihyaa_days)
}

#[tauri::command]
pub async fn get_ihyaa_day_by_id(
    pool: State<'_, PgPool>,
    ihyaa_day_id: i64,
) -> Result<IhyaaDay, String> {
    let row = sqlx::query!(
        r#"
        SELECT 
            d.id as d_id,
            d.day as d_day,
            d.is_done as d_is_done,
            i.id as i_id,
            i.year_georgian,
            i.year_hijri
        FROM ihyaa_days d
        JOIN ihyaa i ON d.ihyaa_id = i.id
        WHERE d.id = $1
        "#,
        ihyaa_day_id
    )
    .fetch_one(&*pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(IhyaaDay {
        id: row.d_id,
        day: row.d_day,
        is_done: row.d_is_done,
        ihyaa: Ihyaa {
            id: row.i_id,
            year_georgian: row.year_georgian,
            year_hijri: row.year_hijri,
        },
    })
}

#[tauri::command]
pub async fn finish_ihyaa_day(
    pool: State<'_, PgPool>,
    ihyaa_day_id: i64,
) -> Result<(), String> {
    sqlx::query!(
        "UPDATE ihyaa_days SET is_done = TRUE WHERE id = $1",
        ihyaa_day_id
    )
    .execute(&*pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(())
}