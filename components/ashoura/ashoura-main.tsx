'use client'
import { Download, Eye, Plus, Trash2 } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { invoke } from "@tauri-apps/api/core"
import { useEffect, useState } from "react"
import { Ihyaa } from "../models"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import Link from "next/link"


export default function AshouraMain() {
    const [ihyaat, setIhyaat] = useState<Ihyaa[]>([])

    const [yearGeorgian, setYearGeorgian] = useState<number>();
    const [yearHijri, setYearHijri] = useState<number>();

    const [confirmation, setConfirmation] = useState<string>("");

    useEffect(() => {
        (async () => {
            const result = await invoke<Ihyaa[]>("get_ihyaat");
            setIhyaat(result)
        })()
    }, [])

    async function addIhyaa() {
        try {
            if (!yearGeorgian || !yearHijri) {
                window.open("Please provide both Georgian and Hijri years.");
                return;
            }

            await invoke("insert_ihyaa", { yearGeorgian, yearHijri });

            const result = await invoke<Ihyaa[]>("get_ihyaat");
            setIhyaat(result);
        } catch (error) {
            console.error("Error adding ihyaa:", error);
        }
    }

    async function handleDeleteIhyaa(id: number) {
        try {
            await invoke("delete_ihyaa", { id });
            const result = await invoke<Ihyaa[]>("get_ihyaat");
            setIhyaat(result);
        } catch (error) {
            console.error("Error deleting ihyaa:", error);
        }
    }

    return (
        <>

            <div className="flex gap-4 items-end">
                <h1 className="text-4xl underline underline-offset-16">الإحياء العاشورائي🚩</h1>
                <Separator orientation="vertical" />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            إضافة إحياء عاشورائي
                            <Plus />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>إضافة إحياء عاشورائي</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div>
                            <Input placeholder="العام الميلادي" type="number" className="mb-4" onChange={e => setYearGeorgian(Number(e.target.value))} />
                            <Input placeholder="العام الهجري" type="number" className="mb-4" onChange={e => setYearHijri(Number(e.target.value))} />
                            <Button className="w-full" variant="default" onClick={() => addIhyaa()}>
                                إضافة الإحياء
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                <Separator orientation="vertical" className="h-16" />
                <span>التاريخ : {new Date().toISOString().split("T")[0]}</span>
            </div>
            <Separator />
            <div className="flex flex-col gap-4">
                <Badge variant="destructive" className="px-2 py-2">قم باختيار الإحياء لمتابعة الحضور</Badge>
                <div className="flex flex-col gap-4">
                    {ihyaat.map((ihyaa) => (
                        <div key={ihyaa.id} className="flex bg-gray-100 shadow-sm justify-between items-center rounded-sm w-full p-2 gap-2">
                            <h1 className="">الإحياء العاشورائي للعام {ihyaa.year_georgian} م - {ihyaa.year_hijri} هـ</h1>
                            <div className="flex gap-2 items-center">
                                <Button variant="outline" asChild>
                                    <Link href={`/ashoura/ihyaa/view?ihyaaId=${ihyaa.id}`}>
                                        عرض تفاصيل الإحياء
                                        <Eye />
                                    </Link>
                                </Button>
                                <DropdownMenu dir="rtl">
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="default" className="bg-green-700 hover:bg-green-800">
                                            تقارير
                                            <Download />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>قم باختيار التقرير</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>أسماء الحضور اليومي</DropdownMenuItem>
                                        <DropdownMenuItem>العدد التراكمي</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-red-700 hover:bg-red-800" variant="destructive" size="icon">
                                            <Trash2 />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>حذف الإحياء العاشورائي</DialogTitle>
                                            <DialogDescription>
                                                هل أنت متأكد من حذف الإحياء العاشورائي للعام {ihyaa.year_georgian} م - {ihyaa.year_hijri} هـ؟
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Input className="border-1 border-red-200 bg-red-100 text-red-900" placeholder="نعم" onChange={e => setConfirmation(e.target.value)} />
                                        <Button variant="destructive" className="w-full" disabled={confirmation !== "نعم"} onClick={() => handleDeleteIhyaa(ihyaa.id)}>
                                            حذف
                                        </Button>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}