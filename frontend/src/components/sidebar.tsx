"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Wallet, TrendingUp, PiggyBank, LogOut, CreditCard } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
    { name: "Income", href: "/dashboard/income", icon: Wallet },
    { name: "Investments", href: "/dashboard/investments", icon: TrendingUp },
    { name: "Goals", href: "/dashboard/goals", icon: PiggyBank },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                    <span className="text-primary">Fintrack</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === item.href
                                    ? "bg-muted text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4 space-y-2">
                <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-medium">Theme</span>
                    <ModeToggle />
                </div>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={() => {
                    localStorage.removeItem("token")
                    window.location.href = "/login"
                }}>
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
