import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/components/models"; // Adjust the path to your model
import { Settings } from "lucide-react";

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "first_name",
        header: "الاسم",
    },
    {
        accessorKey: "father_name",
        header: "اسم الأب",
    },
    {
        accessorKey: "last_name",
        header: "الشهرة",
    },
    {
        accessorKey: "mother_first_name",
        header: "اسم الأم",
    },
    {
        accessorKey: "mother_last_name",
        header: "الشهرة",
    },
    {
        accessorKey: "level",
        header: "المرحلة",
    },
    {
        accessorKey: "dob",
        header: "تاريخ الولادة",
    },
    {
        accessorKey: "status",
        header: "الحالة",
    },
    {
        accessorKey: "",
        header: "الإجراءات",
    },
];
