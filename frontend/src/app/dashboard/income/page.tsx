"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/api"
import { Plus, Trash2 } from "lucide-react"

const INCOME_TYPES = [
    "Cash", "Payslip", "Bank Transfer", "Cheque"
]

export default function IncomePage() {
    const [income, setIncome] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    // Form State
    const [source, setSource] = useState("")
    const [amount, setAmount] = useState("")
    const [type, setType] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    const fetchIncome = async () => {
        try {
            const response = await api.get("/income/")
            setIncome(response.data)
        } catch (error) {
            console.error("Failed to fetch income", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIncome()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post("/income/", {
                source,
                amount: parseFloat(amount),
                type,
                date: new Date(date).toISOString(),
            })
            setOpen(false)
            fetchIncome()
            // Reset form
            setSource("")
            setAmount("")
            setType("")
        } catch (error) {
            console.error("Failed to add income", error)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this income?")) {
            try {
                await api.delete(`/income/${id}`)
                fetchIncome()
            } catch (error) {
                console.error("Failed to delete income", error)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Income</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Income
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Income</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="source">Source</Label>
                                <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Salary, Freelance" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={type} onValueChange={setType} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {INCOME_TYPES.map((t) => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Income</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {income.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No income records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            income.map((inc) => (
                                <TableRow key={inc.id}>
                                    <TableCell>{new Date(inc.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{inc.source}</TableCell>
                                    <TableCell>{inc.type}</TableCell>
                                    <TableCell className="text-green-600 font-medium">+${inc.amount.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(inc.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
