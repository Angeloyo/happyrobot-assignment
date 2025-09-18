"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("freight_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("freight_api_key", apiKey.trim())
      toast.success("API key saved successfully!")
    } else {
      toast.error("Please enter an API key")
    }
  }

  const handleClear = () => {
    localStorage.removeItem("freight_api_key")
    setApiKey("")
    toast.success("API key cleared")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your API settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Enter your API key to access the freight management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              This key will be stored locally in your browser and used to authenticate API requests.
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="bg-foreground hover:bg-foreground/90 text-background"
            >
              <Save className="w-4 h-4 mr-2" />
              Save API Key
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleClear}
              disabled={!apiKey}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
