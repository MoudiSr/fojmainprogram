use serde::{Serialize, Deserialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Student {
    pub id: i64,
    pub first_name: String,
    pub father_name: String,
    pub last_name: String,
    pub mother_first_name: String,
    pub mother_last_name: String,
    pub level: String,
    pub dob: String,
    pub grandfather_name: String,
    pub status: String,
    pub dawra: String
}

#[derive(Debug, Serialize, FromRow)]
pub struct HodorAshoura {
    pub id: i64,
    pub student: Student,
    pub ihyaa_day: IhyaaDay,
    pub date: String
}

#[derive(Debug, Serialize, FromRow)]
pub struct IhyaaDay {
    pub id: i64,
    pub ihyaa: Ihyaa,
    pub day: String,
    pub is_done: bool
}

#[derive(Debug, Serialize, FromRow)]
pub struct Ihyaa {
    pub id: i64,
    pub year_georgian: i64,
    pub year_hijri: i64,
}