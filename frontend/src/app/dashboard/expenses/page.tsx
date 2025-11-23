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

const CATEGORIES = [
    "Work Expenses", "Bus Pass", "Cab - Auto & Transport", "Clothing", "Cosmetics",
    "Credit card bill", "Debt Payment", "Education", "Electronics/Tech", "Fashion", "EMI",
    "Fast food", "Fee & Charges", "Food & Dining", "Footwear", "Gifts & Donations",
    "Groceries", "Gas", "Hair Care", "Home Furnishing", "Hospital Bills", "Insurance",
    "Lent money", "Medicines", "Miscellaneous", "Mortagage", "Mobile Bill", "Movies",
    "Party", "Personal Spending", "Recreation & Entertainment", "Rent", "Savings",
    "Shopping", "Subscriptions", "Taxes", "Travel & Hotels", "Travel Bags", "Utilities"
]

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    // Form State
    const [item, setItem] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [paymentMethod, setPaymentMethod] = useState("")
    const [placeOfPurchase, setPlaceOfPurchase] = useState("")
    const [notes, setNotes] = useState("")

    const fetchExpenses = async () => {
        try {
            const response = await api.get("/expenses/")
            setExpenses(response.data)
        } catch (error) {
            console.error("Failed to fetch expenses", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post("/expenses/", {
                item,
                amount: parseFloat(amount),
                category,
                date: new Date(date).toISOString(),
                payment_method: paymentMethod,
                place_of_purchase: placeOfPurchase,
                notes
            })
            setOpen(false)
            fetchExpenses()
            // Reset form
            setItem("")
            setAmount("")
            setCategory("")
            setPaymentMethod("")
            setPlaceOfPurchase("")
            setNotes("")
        } catch (error) {
            console.error("Failed to add expense", error)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            try {
                await api.delete(`/expenses/${id}`)
                fetchExpenses()
            } catch (error) {
                console.error("Failed to delete expense", error)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Expense
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Expense</DialogTitle>
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
                                <Label htmlFor="item">Item</Label>
                                <Input id="item" value={item} onChange={(e) => setItem(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="paymentMethod">Payment Method</Label>
                                    <Input id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="place">Place of Purchase</Label>
                                    <Input id="place" value={placeOfPurchase} onChange={(e) => setPlaceOfPurchase(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Expense</Button>
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
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No expenses found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{expense.item}</TableCell>
                                    <TableCell>{expense.category}</TableCell>
                                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                                    <TableCell>{expense.payment_method}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
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
