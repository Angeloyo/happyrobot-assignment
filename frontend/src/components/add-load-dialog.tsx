"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface AddLoadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoadCreated?: () => void
}

export function AddLoadDialog({ open, onOpenChange, onLoadCreated }: AddLoadDialogProps) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    pickup_datetime: "",
    delivery_datetime: "",
    equipment_type: "",
    loadboard_rate: "",
    notes: "",
    weight: "",
    commodity_type: "",
    num_of_pieces: "",
    miles: "",
    dimensions: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const apiKey = localStorage.getItem("freight_api_key")
    if (!apiKey) {
      toast.error("Please set your API key in Settings")
      return
    }

    try {
      const response = await fetch("http://localhost:8000/loads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          origin: formData.origin,
          destination: formData.destination,
          pickup_datetime: formData.pickup_datetime,
          delivery_datetime: formData.delivery_datetime,
          equipment_type: formData.equipment_type,
          loadboard_rate: parseFloat(formData.loadboard_rate),
          notes: formData.notes || null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          commodity_type: formData.commodity_type || null,
          num_of_pieces: formData.num_of_pieces ? parseInt(formData.num_of_pieces) : null,
          miles: formData.miles ? parseFloat(formData.miles) : null,
          dimensions: formData.dimensions || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to create load")
      }

      toast.success("Load created successfully!")
      onOpenChange(false)
      onLoadCreated?.() // Refresh the loads table
      
      // Reset form
      setFormData({
        origin: "",
        destination: "",
        pickup_datetime: "",
        delivery_datetime: "",
        equipment_type: "",
        loadboard_rate: "",
        notes: "",
        weight: "",
        commodity_type: "",
        num_of_pieces: "",
        miles: "",
        dimensions: ""
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create load")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Load</DialogTitle>
          <DialogDescription>
            Enter the details for the new freight load.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleInputChange("origin", e.target.value)}
                placeholder="Chicago, IL"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
                placeholder="Atlanta, GA"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup_datetime">Pickup Date & Time *</Label>
              <Input
                id="pickup_datetime"
                type="datetime-local"
                value={formData.pickup_datetime}
                onChange={(e) => handleInputChange("pickup_datetime", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delivery_datetime">Delivery Date & Time *</Label>
              <Input
                id="delivery_datetime"
                type="datetime-local"
                value={formData.delivery_datetime}
                onChange={(e) => handleInputChange("delivery_datetime", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipment_type">Equipment Type *</Label>
              <Input
                id="equipment_type"
                value={formData.equipment_type}
                onChange={(e) => handleInputChange("equipment_type", e.target.value)}
                placeholder="Dry Van, Flatbed, Refrigerated"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loadboard_rate">Rate ($) *</Label>
              <Input
                id="loadboard_rate"
                type="number"
                step="0.01"
                value={formData.loadboard_rate}
                onChange={(e) => handleInputChange("loadboard_rate", e.target.value)}
                placeholder="2500.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="35000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="num_of_pieces">Number of Pieces</Label>
              <Input
                id="num_of_pieces"
                type="number"
                value={formData.num_of_pieces}
                onChange={(e) => handleInputChange("num_of_pieces", e.target.value)}
                placeholder="15"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="miles">Miles</Label>
              <Input
                id="miles"
                type="number"
                step="0.1"
                value={formData.miles}
                onChange={(e) => handleInputChange("miles", e.target.value)}
                placeholder="750"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commodity_type">Commodity Type</Label>
              <Input
                id="commodity_type"
                value={formData.commodity_type}
                onChange={(e) => handleInputChange("commodity_type", e.target.value)}
                placeholder="Electronics, Food Products"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) => handleInputChange("dimensions", e.target.value)}
                placeholder="48x8.5x9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional delivery instructions or special requirements"
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Add Load
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
