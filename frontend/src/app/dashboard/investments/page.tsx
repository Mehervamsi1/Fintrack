"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/lib/api"
import { Plus, Trash2, TrendingUp } from "lucide-react"

const INVESTMENT_TYPES = [
    "Stock", "Mutual Fund", "Crypto", "Bond", "Real Estate"
]

export default function InvestmentsPage() {
    const [investments, setInvestments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    // Form State
    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [type, setType] = useState("")
    const [quantity, setQuantity] = useState("")
    const [purchasePrice, setPurchasePrice] = useState("")
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0])

    const fetchInvestments = async () => {
        try {
            const response = await api.get("/investments/")
            setInvestments(response.data)
        } catch (error) {
            console.error("Failed to fetch investments", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInvestments()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post("/investments/", {
                name,
                symbol,
                type,
                quantity: parseFloat(quantity),
                purchase_price: parseFloat(purchasePrice),
                purchase_date: new Date(purchaseDate).toISOString(),
            })
            setOpen(false)
            fetchInvestments()
            // Reset form
            setName("")
            setSymbol("")
            setType("")
            setQuantity("")
            setPurchasePrice("")
        } catch (error) {
            console.error("Failed to add investment", error)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this investment?")) {
            try {
                await api.delete(`/investments/${id}`)
                fetchInvestments()
            } catch (error) {
                console.error("Failed to delete investment", error)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Investment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Investment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Purchase Date</Label>
                                    <Input id="date" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={type} onValueChange={setType} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INVESTMENT_TYPES.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Apple Inc." required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="symbol">Symbol</Label>
                                    <Input id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g. AAPL" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input id="quantity" type="number" step="0.0001" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Purchase Price (Per Unit)</Label>
                                    <Input id="price" type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} required />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Investment</Button>
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
                            <TableHead>Name (Symbol)</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Purchase Price</TableHead>
                            <TableHead>Total Value</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {investments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No investments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            investments.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell>{new Date(inv.purchase_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{inv.name} ({inv.symbol})</TableCell>
                                    <TableCell>{inv.type}</TableCell>
                                    <TableCell>{inv.quantity}</TableCell>
                                    <TableCell>${inv.purchase_price.toFixed(2)}</TableCell>
                                    <TableCell>${(inv.quantity * inv.purchase_price).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(inv.id)}>
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
