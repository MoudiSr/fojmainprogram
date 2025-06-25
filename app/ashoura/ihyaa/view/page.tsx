'use client'

import { Ihyaa, IhyaaDay } from "@/components/models";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { Eye, SkipBack } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
    const searchParams = useSearchParams()
    const ihyaaId = searchParams.get("ihyaaId");
    const [days, setDays] = useState<IhyaaDay[]>([]);
    const [ihyaa, setIhyaa] = useState<Ihyaa>();

    useEffect(() => {
        (async () => {
            const result = await invoke<IhyaaDay[]>("get_ihyaa_days", { ihyaaId: Number(ihyaaId) })
            setDays(result);

            const result2 = await invoke<Ihyaa>("get_ihyaa_by_id", { id: Number(ihyaaId) })
            setIhyaa(result2)
        })()
    }, [])

    return (
        <div className="p-8 flex flex-col gap-8">
            <div dir="rtl" className="flex  justify-between items-center">
                <h1 className="text-xl">الإحياء العاشورائي للعام {ihyaa?.year_georgian} م - {ihyaa?.year_hijri} هـ</h1>
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/ashoura`}>
                        <SkipBack />
                    </Link>
                </Button>
            </div>
            <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {days.sort((a, b) => Number(a.day) - Number(b.day)).map((day) => (
                    <div key={day.id} className="p-4 flex justify-between items-center gap-2 border rounded shadow-sm">
                        <h2 className="text-xl">🔸اليوم : {day.day}</h2>
                        <Button className="rounded-sm bg-[#76499d] hover:bg-[#76499dde]" size="icon" asChild>
                            <Link href={`/ashoura/ihyaa/day/view?ihyaaId=${ihyaaId}&dayId=${day.id}`}>
                                <Eye />
                            </Link>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Page;