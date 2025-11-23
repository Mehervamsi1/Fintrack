"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import api from "@/lib/api"
import { Plus, Trash2, PiggyBank } from "lucide-react"

export default function GoalsPage() {
    const [goals, setGoals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    // Form State
    const [name, setName] = useState("")
    const [targetAmount, setTargetAmount] = useState("")
    const [currentAmount, setCurrentAmount] = useState("0")
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0])

    const fetchGoals = async () => {
        try {
            const response = await api.get("/goals/")
            setGoals(response.data)
        } catch (error) {
            console.error("Failed to fetch goals", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post("/goals/", {
                name,
                target_amount: parseFloat(targetAmount),
                current_amount: parseFloat(currentAmount),
                target_date: new Date(targetDate).toISOString(),
            })
            setOpen(false)
            fetchGoals()
            // Reset form
            setName("")
            setTargetAmount("")
            setCurrentAmount("0")
        } catch (error) {
            console.error("Failed to add goal", error)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this goal?")) {
            try {
                await api.delete(`/goals/${id}`)
                fetchGoals()
            } catch (error) {
                console.error("Failed to delete goal", error)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Goals & Piggy Banks</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Savings Goal</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Goal Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vacation to Paris" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="targetAmount">Target Amount</Label>
                                    <Input id="targetAmount" type="number" step="0.01" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currentAmount">Current Savings</Label>
                                    <Input id="currentAmount" type="number" step="0.01" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="targetDate">Target Date</Label>
                                <Input id="targetDate" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Goal</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => {
                    const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
                    return (
                        <Card key={goal.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {goal.name}
                                </CardTitle>
                                <PiggyBank className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${goal.current_amount.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">
                                    of ${goal.target_amount.toFixed(2)} goal
                                </p>
                                <div className="mt-4 h-2 w-full rounded-full bg-secondary">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground text-right">
                                    {progress.toFixed(1)}%
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" size="sm" className="w-full text-red-500 hover:text-red-600" onClick={() => handleDelete(goal.id)}>
                                    Delete Goal
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
                {goals.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 border rounded-lg border-dashed text-muted-foreground">
                        <PiggyBank className="h-12 w-12 mb-4 opacity-50" />
                        <p>No goals set yet. Start saving today!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
