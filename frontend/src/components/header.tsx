"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, Truck, BarChart3 } from "lucide-react"

export function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-foreground">
            Acme Logistics
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/dashboard")
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              href="/loads"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/loads")
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Loads</span>
            </Link>
            
            <Link
              href="/settings"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/settings")
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
