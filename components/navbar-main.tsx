import { CalendarIcon, FlagIcon, HomeIcon, MenuIcon, SunIcon, UsersIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import { Button } from "./ui/button";

const NavbarMain = () => {
    const navLinks = [
        {
            label: "الصفحة الرئيسية",
            href: "/",
            icon: HomeIcon
        },
        {
            label: "حضور الأنشطة",
            href: "/attendance",
            icon: CalendarIcon
        },
        {
            label: "قيادة الفرقة",
            href: "/leadership",
            icon: UsersIcon
        },
        {
            label: "الاحياء العاشورائي",
            href: "/ashoura",
            icon: FlagIcon
        },
        {
            label: "النوادي الصيفية",
            href: "/summerclubs",
            icon: SunIcon
        }
    ]

    return (
        <nav className="flex justify-between items-center p-4 shadow-sm" dir="rtl">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" >
                        <MenuIcon className="size-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Al Mahdi - Jebchit</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4" dir="rtl">
                        {navLinks.map((link) => (
                            <div className="px-3" key={link.label}>
                                <Link href={link.href} className="flex w-full items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                                    <link.icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </nav>
    )
}

export default NavbarMain;