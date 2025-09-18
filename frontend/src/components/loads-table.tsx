"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Load } from "@/lib/types"

export function LoadsTable() {
  const [loads, setLoads] = useState<Load[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLoads()
  }, [])

  const fetchLoads = async () => {
    const apiKey = localStorage.getItem("freight_api_key")
    if (!apiKey) {
      toast.error("Please set your API key in Settings")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8000/loads", {
        method: "GET",
        headers: {
          "X-API-Key": apiKey,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch loads")
      }

      const loadsData = await response.json()
      setLoads(loadsData)
    } catch (error) {
      toast.error("Failed to fetch loads")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (loadId: string) => {
    const apiKey = localStorage.getItem("freight_api_key")
    if (!apiKey) {
      toast.error("Please set your API key in Settings")
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/loads/${loadId}`, {
        method: "DELETE",
        headers: {
          "X-API-Key": apiKey,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete load")
      }

      toast.success("Load deleted successfully!")
      fetchLoads() // Refresh the table
    } catch (error) {
      toast.error("Failed to delete load")
      console.error(error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + 
           new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (loads.length === 0) {
    return (
      <div className="border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No loads found. Create your first load to get started!</p>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="font-semibold text-foreground">Load ID</TableHead>
            <TableHead className="font-semibold text-foreground">Origin</TableHead>
            <TableHead className="font-semibold text-foreground">Destination</TableHead>
            <TableHead className="font-semibold text-foreground">Pickup</TableHead>
            <TableHead className="font-semibold text-foreground">Delivery</TableHead>
            <TableHead className="font-semibold text-foreground">Equipment</TableHead>
            <TableHead className="font-semibold text-foreground">Rate</TableHead>
            <TableHead className="font-semibold text-foreground">Weight</TableHead>
            <TableHead className="font-semibold text-foreground">Miles</TableHead>
            <TableHead className="font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loads.map((load) => (
            <TableRow key={load.load_id} className="border-b border-border hover:bg-muted/50">
              <TableCell className="font-mono text-sm">{load.load_id.substring(0, 8)}...</TableCell>
              <TableCell>{load.origin}</TableCell>
              <TableCell>{load.destination}</TableCell>
              <TableCell className="text-sm">{formatDate(load.pickup_datetime)}</TableCell>
              <TableCell className="text-sm">{formatDate(load.delivery_datetime)}</TableCell>
              <TableCell>{load.equipment_type}</TableCell>
              <TableCell className="font-semibold">{formatCurrency(load.loadboard_rate)}</TableCell>
              <TableCell>{load.weight ? `${load.weight.toLocaleString()} lbs` : "-"}</TableCell>
              <TableCell>{load.miles ? load.miles.toLocaleString() : "-"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(load.load_id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
