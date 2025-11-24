"use client"

import { useEffect, useState } from "react"
import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/glass-card"
import api from "@/lib/api"
import { Sparkles, AlertTriangle, TrendingUp, Info, Target } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"

interface Insight {
    type: "warning" | "success" | "info" | "suggestion"
    title: string
    message: string
}

export function AIInsights() {
    const [insights, setInsights] = useState<Insight[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await api.get("/dashboard/insights")
                setInsights(response.data)
            } catch (error) {
                console.error("Failed to fetch insights", error)
            } finally {
                setLoading(false)
            }
        }
        fetchInsights()
    }, [])

    if (loading) return null
    if (insights.length === 0) return null

    const getIcon = (type: string) => {
        switch (type) {
            case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-400" />
            case "success": return <TrendingUp className="h-5 w-5 text-green-400" />
            case "suggestion": return <Target className="h-5 w-5 text-blue-400" />
            default: return <Info className="h-5 w-5 text-gray-400" />
        }
    }

    return (
        <GlassCard className="h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                    <FadeIn key={index} delay={index * 0.1} className="flex gap-3 items-start p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="mt-0.5">{getIcon(insight.type)}</div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-200">{insight.title}</h4>
                            <p className="text-xs text-gray-400 mt-1">{insight.message}</p>
                        </div>
                    </FadeIn>
                ))}
            </CardContent>
        </GlassCard>
    )
}
