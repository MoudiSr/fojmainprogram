use sqlx::PgPool;
use tauri::State;
use crate::models::{HodorAshoura, Ihyaa, IhyaaDay, Student};

#[tauri::command]
pub async fn get_hodor_ashoura_by_day_id(
    pool: State<'_, PgPool>,
    day_id: i64,
) -> Result<Vec<HodorAshoura>, String> {
    let rows = sqlx::query!(
        r#"
        SELECT
            -- HodorAshoura
            ha.id AS ha_id,
            ha.date,

            -- Student
            s.id AS s_id,
            s.first_name,
            s.father_name,
            s.last_name,
            s.mother_first_name,
            s.mother_last_name,
            s.level,
            s.dob,
            s.grandfather_name,
            s.status,
            s.dawra,

            -- IhyaaDay
            d.id AS d_id,
            d.day AS d_day,
            d.is_done,

            -- Ihyaa
            i.id AS i_id,
            i.year_georgian,
            i.year_hijri

        FROM hodor_ashoura ha
        JOIN students s ON ha.student_id = s.id
        JOIN ihyaa_days d ON ha.ihyaa_day_id = d.id
        JOIN ihyaa i ON d.ihyaa_id = i.id
        WHERE ha.ihyaa_day_id = $1
        ORDER BY ha.date DESC
        "#,
        day_id
    )
    .fetch_all(&*pool)
    .await
    .map_err(|e| e.to_string())?;

    let result = rows
        .into_iter()
        .map(|row| HodorAshoura {
            id: row.ha_id,
            date: row.date,
            student: Student {
                id: row.s_id,
                first_name: row.first_name,
                father_name: row.father_name,
                last_name: row.last_name,
                mother_first_name: row.mother_first_name,
                mother_last_name: row.mother_last_name,
                level: row.level,
                dob: row.dob,
                grandfather_name: row.grandfather_name,
                status: row.status,
                dawra: row.dawra,
            },
            ihyaa_day: IhyaaDay {
                id: row.d_id,
                day: row.d_day,
                is_done: row.is_done,
                ihyaa: Ihyaa {
                    id: row.i_id,
                    year_georgian: row.year_georgian,
                    year_hijri: row.year_hijri,
                },
            },
        })
        .collect();

    Ok(result)
}

#[tauri::command]
pub async fn add_hodor_ashoura(
    pool: State<'_, PgPool>,
    student_id: i64,
    ihyaa_day_id: i64,
    date: String,
) -> Result<(), String> {
    sqlx::query("INSERT INTO hodor_ashoura (student_id, ihyaa_day_id, date) VALUES ($1, $2, $3)")
        .bind(student_id)
        .bind(ihyaa_day_id)
        .bind(date)
        .execute(&*pool)
        .await
        .map_err(|e| format!("Failed to insert hodor ashoura : {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn delete_hodor_ashoura(
    pool: State<'_, PgPool>,
    id: i64,
) -> Result<(), String> {
    sqlx::query("DELETE FROM hodor_ashoura WHERE id = $1")
        .bind(id)
        .execute(&*pool)
        .await
        .map_err(|e| format!("Failed to delete hodor ashoura : {}", e))?;

    Ok(())
}