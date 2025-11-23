"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api"
import { DollarSign, TrendingDown, TrendingUp, Activity } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"

export default function DashboardPage() {
    const [summary, setSummary] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get("/dashboard/summary")
                setSummary(response.data)
            } catch (error) {
                console.error("Failed to fetch dashboard summary", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSummary()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!summary) {
        return <div>Error loading dashboard</div>
    }

    return (
        <div className="space-y-6">
            <FadeIn>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </FadeIn>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FadeIn delay={0.1}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${summary.total_income.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${summary.total_expenses.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${summary.net_balance.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                </FadeIn>
                <FadeIn delay={0.4}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.active_goals_count}</div>
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>

            <FadeIn delay={0.5} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* Chart placeholder */}
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Chart Area (Recharts to be implemented)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {summary.recent_expenses.map((expense: any) => (
                                <div key={expense.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{expense.item}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {expense.category}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-red-500">-${expense.amount.toFixed(2)}</div>
                                </div>
                            ))}
                            {summary.recent_income.map((income: any) => (
                                <div key={income.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{income.source}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {income.type}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-green-500">+${income.amount.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </FadeIn>
        </div>
    )
}
