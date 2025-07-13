'use client';
import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Student } from "@/components/models";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { invoke } from "@tauri-apps/api/core";
import { Import, Search, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

const Page = () => {
  const [validStudents, setValidStudents] = useState<Student[]>([]);
  const [invalidStudents, setInvalidStudents] = useState<Student[]>([]);

  const [confirmation, setConfirmation] = useState<string>("");

  useEffect(() => {
    (async () => {
      const result = await invoke<Student[]>('get_students');
      setValidStudents(result.filter(student => student.status === 'فعلي'));
      setInvalidStudents(result.filter(student => student.status !== 'فعلي'));
    })()
  }, []);

  const expectedHeaders = ["first_name", "father_name", "last_name", "mother_first_name", "mother_last_name", "level", "dob", "grandfather_name", "status", "dawra"];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  function excelDateToJSDate(serial: number): Date {
    const utc_days = serial - 25569;
    const utc_value = utc_days * 86400;
    return new Date(utc_value * 1000);
  }


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const headers = jsonData[0]?.map((cell: any) => String(cell).toLowerCase().trim());
    const isValid = JSON.stringify(headers) === JSON.stringify(expectedHeaders);

    if (!isValid) {
      toast.error("❌ ملف Excel غير صالح. يجب أن يحتوي على الأعمدة: code, fullname, mothername, level, dob, foj, fi2a");
      return;
    }

    const students: Student[] = jsonData.slice(1).map((row: any[]) => ({
      id: 0,
      first_name: row[0] || "",
      father_name: row[1] || "",
      last_name: row[2] || "",
      mother_first_name: row[3] || "",
      mother_last_name: row[4] || "",
      level: row[5] || "",
      dob: row[6] ? excelDateToJSDate(row[6]).toISOString().split("T")[0] : "",
      grandfather_name: row[7] || "",
      status: row[8] || "",
      dawra: row[9] || ""
    }));


    try {
      console.log("Importing students:", students[0]);
      const temp = await invoke('import_students', { students });
      toast.message("" + temp + "")
      toast.message('✅ تم إضافة البيانات بنجاح!');
      const result = await invoke<Student[]>("get_students")
      setValidStudents(result.filter(student => student.status === 'فعلي'));
      setInvalidStudents(result.filter(student => student.status !== 'فعلي'));
    } catch (err) {
      console.error(err);
      toast.error(String(err))
    }

    event.target.value = '';
  };

  const dropStudents = async () => {
    try {
      await invoke('delete_all_students_and_restore_sequence');
      toast.success('✅ تم حذف البيانات بنجاح!');
      setValidStudents([]);
      setInvalidStudents([]);
    } catch (err) {
      console.error(err);
      toast.error('❌ حدث خطأ أثناء حذف البيانات: ' + String(err));
    }
  };


  return (
    <div dir="rtl" className="p-8 flex flex-col w-full">
      <Tabs defaultValue="valid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="valid" className="cursor-pointer">أسماء الأفراد الكشفيين</TabsTrigger>
          <TabsTrigger value="invalid" className="cursor-pointer">أسماء الأفراد غير الكشفيين</TabsTrigger>
        </TabsList>
        <TabsContent value="valid" dir="rtl">
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="secondary" className="bg-green-700 hover:bg-green-800 text-white border-2 border-black rounded-sm" onClick={handleButtonClick}>
                  <Import />
                  ادخال كشف الأسماء
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="bg-red-700 hover:bg-red-800 text-white ml-4 border-2 border-black rounded-sm">
                      <Trash2 />
                      الغاء جميع الأسماء
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>حذف كشف الأسماء</DialogTitle>
                      <DialogDescription>
                        هل حقاً تريد حذف جميع الأفراد ؟
                      </DialogDescription>
                    </DialogHeader>
                    <Input className="border-1 border-red-200 bg-red-100 text-red-900" placeholder="نعم" onChange={e => setConfirmation(e.target.value)} />
                    <Button variant="destructive" className="w-full" disabled={confirmation !== "نعم"} onClick={() => dropStudents()}>
                      حذف
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
              <div dir="rtl">
                <div className="relative w-full">
                  <div className="absolute top-0 left-0 bg-gray-300 p-2 rounded-sm">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input placeholder="ابحث عن اسم أو مستوى" className="w-92" />
                </div>
              </div>
            </div>
            <DataTable columns={columns} data={validStudents} />
          </div>
        </TabsContent>
        <TabsContent value="invalid" dir="rtl">
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex">
                
              </div>
              <div dir="rtl">
                <div className="relative w-full">
                  <div className="absolute top-0 left-0 bg-gray-300 p-2 rounded-sm">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input placeholder="ابحث عن اسم أو مستوى" className="w-92" />
                </div>
              </div>
            </div>
            <DataTable columns={columns} data={invalidStudents} />
          </div>
        </TabsContent>
      </Tabs>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default Page;