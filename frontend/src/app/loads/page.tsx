"use client"

import { useState } from "react"
import { LoadsTable } from "@/components/loads-table"
import { AddLoadDialog } from "@/components/add-load-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function LoadsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleLoadCreated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loads</h1>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Load
        </Button>
      </div>

      <LoadsTable key={refreshTrigger} />

      <AddLoadDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onLoadCreated={handleLoadCreated}
      />
    </div>
  )
}
