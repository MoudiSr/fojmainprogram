import { CalendarIcon, FlagIcon, HomeIcon, MenuIcon, SunIcon, UsersIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Link from "next/link";

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
            label: "عاشوراء",
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
        <nav className="flex justify-between items-center p-4 shadow-sm">
            <Sheet>
                <SheetTrigger>
                    <MenuIcon />
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Al Mahdi - Jebchit</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link href={link.href}>
                                <link.icon />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </nav>
    )
}

export default NavbarMain;