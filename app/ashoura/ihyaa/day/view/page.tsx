'use client';
import { HodorAshoura, IhyaaDay } from "@/components/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { invoke } from "@tauri-apps/api/core";
import { SkipBack, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
    const searchParams = useSearchParams()
    const ihyaaId = searchParams.get("ihyaaId")
    const dayId = searchParams.get("dayId")
    const [hodorAshoura, setHodorAshoura] = useState<HodorAshoura[]>([]);
    const [ihyaaDay, setIhyaaDay] = useState<IhyaaDay>();

    useEffect(() => {
        (async () => {
            const result = await invoke<IhyaaDay>("get_ihyaa_day_by_id", {
                ihyaaDayId: Number(dayId)
            })
            setIhyaaDay(result)

            const result1 = await invoke<HodorAshoura[]>("get_hodor_ashoura_by_day_id", {
                dayId: Number(dayId)
            })
            setHodorAshoura(result1)
        })()
    }, [])

    const [studentId, setStudentId] = useState("");

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && studentId.trim() !== "") {
            try {
                let duplicate = false
                hodorAshoura.forEach(hodor => {
                    if (hodor.student.id === Number(studentId)) {
                        duplicate = true;
                    }
                })

                if (duplicate) {
                    toast.message("تم تسجيل الحضور مسبقاً")
                    setStudentId("")
                    return
                }

                await invoke<HodorAshoura>("add_hodor_ashoura", {
                    studentId: Number(studentId),
                    ihyaaDayId: Number(ihyaaDay?.id),
                    date: new Date().toISOString()
                });

                const result1 = await invoke<HodorAshoura[]>("get_hodor_ashoura_by_day_id", {
                    dayId: Number(dayId)
                })
                setHodorAshoura(result1)
                setStudentId("");
            } catch (err) {
                console.log(err)
                toast.message("لم يتم العثور على الفرد")
            }
        }
    };

    const handleDeleteHodorAshoura = async (hodorId: number) => {
        await invoke("delete_hodor_ashoura", { id: hodorId })
        const result1 = await invoke<HodorAshoura[]>("get_hodor_ashoura_by_day_id", {
            dayId: Number(dayId)
        })
        setHodorAshoura(result1)
    }

    const setColorLevel = (level: string) => {
        if (level === "قائد") {
            return "bg-[#F99F38]"
        } else if (level === "جوال") {
            return "bg-[#ED1C24]"
        } else if (level === "كشافة") {
            return "bg-[#008B4B]"
        } else if (level === "شبل") {
            return "bg-[#FFF200]"
        } else if (level === "براعم") {
            return "bg-[#2E3D70]"
        } else {
            return ""
        }
    }

    const [levelFilter, setLevelFilter] = useState("كشافة")

    const filteredHodorAshoura = hodorAshoura.filter(hodor => hodor.student.level === levelFilter)

    return (
        <div dir="rtl" className="flex flex-col gap-4 p-8">

            <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold underline">الإحياء العاشورائي للعام {ihyaaDay?.ihyaa.year_georgian} م - {ihyaaDay?.ihyaa.year_hijri} هـ</h1>
                    <div className="flex gap-2">
                        <h1 className="text-xl text-gray-600">اليوم رقم {ihyaaDay?.day}</h1>
                        <h1 className="text-xl text-gray-600">الحضور : ({hodorAshoura.length})</h1>
                        <h1 className="text-lg text-gray-500">| قائد : ({hodorAshoura.filter(hodor => hodor.student.level === "قائد").length})</h1>
                        <h1 className="text-lg text-gray-500">| جوال : ({hodorAshoura.filter(hodor => hodor.student.level === "جوال").length})</h1>
                        <h1 className="text-lg text-gray-500">| كشافة : ({hodorAshoura.filter(hodor => hodor.student.level === "كشافة").length})</h1>
                        <h1 className="text-lg text-gray-500">| شبل : ({hodorAshoura.filter(hodor => hodor.student.level === "شبل").length})</h1>
                        <h1 className="text-lg text-gray-500">| براعم : ({hodorAshoura.filter(hodor => hodor.student.level === "براعم").length})</h1>
                    </div>
                </div>
                <div>
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/ashoura/ihyaa/view?ihyaaId=${ihyaaId}`}>
                            <SkipBack />
                        </Link>
                    </Button>
                </div>
            </div>
            <div>
                <Input placeholder="قم بتسجيل الحضور عبر ادخال الرقم" type="number" className="w-full" value={studentId} onChange={e => setStudentId(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
            <Tabs defaultValue="3" className="w-full" dir="rtl">
                <TabsList className="w-full">
                    <TabsTrigger value="1" className="cursor-pointer" onClick={() => setLevelFilter("براعم")}>براعم</TabsTrigger>
                    <TabsTrigger value="2" className="cursor-pointer" onClick={() => setLevelFilter("شبل")}>شبل</TabsTrigger>
                    <TabsTrigger value="3" className="cursor-pointer" onClick={() => setLevelFilter("كشافة")}>كشافة</TabsTrigger>
                    <TabsTrigger value="4" className="cursor-pointer" onClick={() => setLevelFilter("جوال")}>جوال</TabsTrigger>
                    <TabsTrigger value="5" className="cursor-pointer" onClick={() => setLevelFilter("قائد")}>قائد</TabsTrigger>
                </TabsList>
                <TabsContent value="1" dir="ltr" className="flex flex-col gap-4">
                    {filteredHodorAshoura.map(hodor => (
                        <div key={hodor.id} className="flex justify-between items-center p-2 border rounded-sm shadow-sm bg-gray-100">
                            <div className="flex gap-2 items-center">
                                <p>{hodor.student !== null ? hodor.student.id : ""}</p>
                                <span>{hodor.student !== null ? hodor.student.first_name + " " + hodor.student.father_name + " " + hodor.student.last_name : ""}</span>
                                <span className={`p-1 px-4 rounded-sm ${hodor.student.level === "شبل" ? "text-black" : "text-white"} ${setColorLevel(hodor.student.level)}`}>{hodor.student.level}</span>
                                <span>{hodor.student.dob}</span>
                            </div>
                            <Button onClick={() => {
                                handleDeleteHodorAshoura(hodor.id)
                            }} size="icon" className="bg-red-500 rounded-sm hover:bg-red-600">
                                <Trash2 className="size-5" />
                            </Button>
                        </div>
                    ))}
                </TabsContent>
                <TabsContent value="2" className="flex flex-col gap-4">
                    {filteredHodorAshoura.map(hodor => (
                        <div key={hodor.id} className="flex justify-between items-center p-2 border rounded-sm shadow-sm bg-gray-100">
                            <div className="flex gap-2 items-center ">
                                <p>{hodor.student !== null ? hodor.student.id : ""}</p>
                                <span>{hodor.student !== null ? hodor.student.first_name + " " + hodor.student.father_name + " " + hodor.student.last_name : ""}</span>
                                <span className={`p-1 px-4 rounded-sm ${hodor.student.level === "شبل" ? "text-black" : "text-white"} ${setColorLevel(hodor.student.level)}`}>{hodor.student.level}</span>
                                <span>{hodor.student.dob}</span>
                            </div>
                            <Button onClick={() => {
                                handleDeleteHodorAshoura(hodor.id)
                            }} size="icon" className="bg-red-500 rounded-sm hover:bg-red-600">
                                <Trash2 className="size-5" />
                            </Button>
                        </div>
                    ))}
                </TabsContent>
                <TabsContent value="3" className="flex flex-col gap-4">
                    {filteredHodorAshoura.map(hodor => (
                        <div key={hodor.id} className="flex justify-between items-center p-2 border rounded-sm shadow-sm bg-gray-100">
                            <div className="flex gap-2 items-center ">
                                <p>{hodor.student !== null ? hodor.student.id : ""}</p>
                                <span>{hodor.student !== null ? hodor.student.first_name + " " + hodor.student.father_name + " " + hodor.student.last_name : ""}</span>
                                <span className={`p-1 px-4 rounded-sm ${hodor.student.level === "شبل" ? "text-black" : "text-white"} ${setColorLevel(hodor.student.level)}`}>{hodor.student.level}</span>
                                <span>{hodor.student.dob}</span>
                            </div>
                            <Button onClick={() => {
                                handleDeleteHodorAshoura(hodor.id)
                            }} size="icon" className="bg-red-500 rounded-sm hover:bg-red-600">
                                <Trash2 className="size-5" />
                            </Button>
                        </div>
                    ))}
                </TabsContent>
                <TabsContent value="4" className="flex flex-col gap-4">
                    {filteredHodorAshoura.map(hodor => (
                        <div key={hodor.id} className="flex justify-between items-center p-2 border rounded-sm shadow-sm bg-gray-100">
                            <div className="flex gap-2 items-center ">
                                <p>{hodor.student !== null ? hodor.student.id : ""}</p>
                                <span>{hodor.student !== null ? hodor.student.first_name + " " + hodor.student.father_name + " " + hodor.student.last_name : ""}</span>
                                <span className={`p-1 px-4 rounded-sm ${hodor.student.level === "شبل" ? "text-black" : "text-white"} ${setColorLevel(hodor.student.level)}`}>{hodor.student.level}</span>
                                <span>{hodor.student.dob}</span>
                            </div>
                            <Button onClick={() => {
                                handleDeleteHodorAshoura(hodor.id)
                            }} size="icon" className="bg-red-500 rounded-sm hover:bg-red-600">
                                <Trash2 className="size-5" />
                            </Button>
                        </div>
                    ))}
                </TabsContent>
                <TabsContent value="5" className="flex flex-col gap-4">
                    {filteredHodorAshoura.map(hodor => (
                        <div key={hodor.id} className="flex justify-between items-center p-2 border rounded-sm shadow-sm bg-gray-100">
                            <div className="flex gap-2 items-center ">
                                <p>{hodor.student !== null ? hodor.student.id : ""}</p>
                                <span>{hodor.student !== null ? hodor.student.first_name + " " + hodor.student.father_name + " " + hodor.student.last_name : ""}</span>
                                <span className={`p-1 px-4 rounded-sm ${hodor.student.level === "شبل" ? "text-black" : "text-white"} ${setColorLevel(hodor.student.level)}`}>{hodor.student.level}</span>
                                <span>{hodor.student.dob}</span>
                            </div>
                            <Button onClick={() => {
                                handleDeleteHodorAshoura(hodor.id)
                            }} size="icon" className="bg-red-500 rounded-sm hover:bg-red-600">
                                <Trash2 className="size-5" />
                            </Button>
                        </div>
                    ))}
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default Page;