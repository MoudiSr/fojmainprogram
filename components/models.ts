export interface Student {
    id: number;
    first_name: string;
    father_name: string;
    last_name: string;
    mother_first_name: string;
    mother_last_name: string;
    level: string;
    dob: string;
    grandfather_name: string;
    status: string;
    dawra: string;
}

export interface HodorAshoura {
    id: number;
    student_id: number;
    ihyaa_day_id: number;
    student: Student;
    ihyaa_day: IhyaaDay;
    date: string;
}

export interface IhyaaDay {
    id: number;
    ihyaa_id: number;
    ihyaa: Ihyaa;
    day: number;
    is_done: boolean;
}

export interface Ihyaa {
    id: number;
    year_georgian: number;
    year_hijri: number;
}
