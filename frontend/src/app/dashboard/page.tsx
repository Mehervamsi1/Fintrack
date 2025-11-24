"use client"

import { useEffect, useState } from "react"
import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/glass-card"
import api from "@/lib/api"
import { DollarSign, TrendingDown, TrendingUp, Activity } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"

import { AIInsights } from "@/components/dashboard/ai-insights"

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
        return <div className="flex h-full items-center justify-center text-muted-foreground">Loading dashboard...</div>
    }

    if (!summary) {
        return <div className="text-red-500">Error loading dashboard</div>
    }

    return (
        <div className="space-y-6">
            <FadeIn>
                <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Dashboard</h1>
            </FadeIn>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <FadeIn delay={0.1}>
                    <GlassCard className="transition-all hover:shadow-2xl hover:-translate-y-1 hover:bg-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-200">Total Income</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">${summary.total_income.toFixed(2)}</div>
                        </CardContent>
                    </GlassCard>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <GlassCard className="transition-all hover:shadow-2xl hover:-translate-y-1 hover:bg-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-200">Total Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-rose-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">${summary.total_expenses.toFixed(2)}</div>
                        </CardContent>
                    </GlassCard>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <GlassCard className="transition-all hover:shadow-2xl hover:-translate-y-1 hover:bg-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-200">Net Balance</CardTitle>
                            <DollarSign className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">${summary.net_balance.toFixed(2)}</div>
                        </CardContent>
                    </GlassCard>
                </FadeIn>
                <FadeIn delay={0.4}>
                    <GlassCard className="transition-all hover:shadow-2xl hover:-translate-y-1 hover:bg-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-200">Active Goals</CardTitle>
                            <Activity className="h-4 w-4 text-violet-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{summary.active_goals_count}</div>
                        </CardContent>
                    </GlassCard>
                </FadeIn>
            </div>

            <FadeIn delay={0.5} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 space-y-4">
                    <GlassCard>
                        <CardHeader>
                            <CardTitle className="text-white">Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {/* Chart placeholder */}
                            <div className="h-[200px] flex items-center justify-center text-muted-foreground border border-dashed border-white/20 rounded-md">
                                Chart Area (Recharts to be implemented)
                            </div>
                        </CardContent>
                    </GlassCard>
                    <AIInsights />
                </div>
                <GlassCard className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Transactions</CardTitle>
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
                                        <p className="text-sm font-medium leading-none text-white">{income.source}</p>
                                        <p className="text-sm text-gray-400">
                                            {income.type}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-emerald-400">+${income.amount.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </GlassCard>
            </FadeIn>
        </div>
    )
}
