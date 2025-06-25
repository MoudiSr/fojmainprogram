'use client';
import { HodorAshoura, IhyaaDay } from "@/components/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { invoke } from "@tauri-apps/api/core";
import { SkipBack } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

    return (
        <div dir="rtl" className="flex flex-col gap-4 p-8">

            <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold underline">الإحياء العاشورائي للعام {ihyaaDay?.ihyaa.year_georgian} م - {ihyaaDay?.ihyaa.year_hijri} هـ</h1>
                    <h1 className="text-xl text-gray-600">اليوم رقم {ihyaaDay?.day}</h1>
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
                <Input placeholder="قم بتسجيل الحضور عبر ادخال الرقم" className="w-full"  />
            </div>
            {hodorAshoura.map(hodor => (
                <div>
                    {hodor.ihyaa_day_id}
                </div>
            ))}
        </div>
    )
}

export default Page;