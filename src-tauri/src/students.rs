use crate::models::Student;
use sqlx::PgPool;
use tauri::State;

#[tauri::command]
pub async fn get_students(pool: State<'_, PgPool>) -> Result<Vec<Student>, String> {
    let students = sqlx::query_as::<_, Student>("SELECT * FROM students ORDER BY id DESC")
        .fetch_all(&*pool)
        .await
        .map_err(|e| e.to_string())?;
    Ok(students)
}

#[tauri::command]
pub async fn insert_student(
    pool: State<'_, PgPool>,
    first_name: String,
    father_name: String,
    last_name: String,
    mother_first_name: String,
    mother_last_name: String,
    level: String,
    dob: String,
    grandfather_name: String,
    status: String,
    dawra: String,
) -> Result<Student, String> {
    let student = sqlx::query_as::<_, Student>(
        "INSERT INTO students (first_name, father_name, last_name, mother_first_name, mother_last_name, level, dob, grandfather_name, status, dawra) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    )
    .bind(first_name)
    .bind(father_name)
    .bind(last_name)
    .bind(mother_first_name)
    .bind(mother_last_name)
    .bind(level)
    .bind(dob)
    .bind(grandfather_name)
    .bind(status)
    .bind(dawra)
    .fetch_one(&*pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(student)
}

#[tauri::command]
pub async fn import_students(
    pool: State<'_, PgPool>,
    students: serde_json::Value,
) -> Result<(), String> {
    println!("RECEIVED: {}", students);
    let students: Vec<Student> =
        serde_json::from_value(students).map_err(|e| format!("Deserialize error: {}", e))?;

    for student in students {
        sqlx::query(
            "INSERT INTO students (first_name, father_name, last_name, mother_first_name, mother_last_name, level, dob, grandfather_name, status, dawra) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        )
        .bind(&student.first_name)
        .bind(&student.father_name)
        .bind(&student.last_name)
        .bind(&student.mother_first_name)
        .bind(&student.mother_last_name)
        .bind(&student.level)
        .bind(&student.dob)
        .bind(&student.grandfather_name)
        .bind(&student.status)
        .bind(&student.dawra)
        .execute(&*pool)
        .await
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub async fn delete_student(
    pool: State<'_, PgPool>,
    student_id: i32,
) -> Result<(), String> {
    sqlx::query("DELETE FROM students WHERE id = $1")
        .bind(student_id)
        .execute(&*pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn edit_student(
    pool: State<'_, PgPool>,
    student_id: i32,
    first_name: String,
    father_name: String,
    last_name: String,
    mother_first_name: String,
    mother_last_name: String,
    level: String,
    dob: String,
    grandfather_name: String,
    status: String,
    dawra: String,
) -> Result<Student, String> {
    let student = sqlx::query_as::<_, Student>(
        "UPDATE students SET first_name = $1, father_name = $2, last_name = $3, mother_first_name = $4, mother_last_name = $5, level = $6, dob = $7, grandfather_name = $8, status = $9, dawra = $10 WHERE id = $11 RETURNING *",
    )
    .bind(first_name)
    .bind(father_name)
    .bind(last_name)
    .bind(mother_first_name)
    .bind(mother_last_name)
    .bind(level)
    .bind(dob)
    .bind(grandfather_name)
    .bind(status)
    .bind(dawra)
    .bind(student_id)
    .fetch_one(&*pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(student)
}

#[tauri::command]
pub async fn delete_all_students_and_restore_sequence(
    pool: State<'_, PgPool>,
) -> Result<(), String> {
    sqlx::query("DELETE FROM students")
        .execute(&*pool)
        .await
        .map_err(|e| e.to_string())?;

    sqlx::query("ALTER SEQUENCE students_id_seq RESTART WITH 1")
        .execute(&*pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}