"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { MaintenancePage } from "./maintenance-page"

interface MaintenanceModeProps {
  children: React.ReactNode
}

export default function MaintenanceMode({ children }: MaintenanceModeProps) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkMaintenanceStatus()
    
    // Check maintenance status every 5 minutes
    const interval = setInterval(checkMaintenanceStatus, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const checkMaintenanceStatus = async () => {
    try {
      setLoading(true)
      
      // Try health check first - handle 503 as valid maintenance response
      try {
        const healthResponse = await api.checkHealth()
        
        if (healthResponse.success === false && (healthResponse as any).maintenance === true) {
          setIsMaintenanceMode(true)
          setMaintenanceMessage((healthResponse as any).message || "We are currently undergoing maintenance. Please check back soon.")
          return
        }
      } catch (healthError: any) {
        // If we get a 503 error, it means maintenance mode is active
        if (healthError.message.includes('503')) {
          setIsMaintenanceMode(true)
          setMaintenanceMessage("Service is under maintenance")
          return
        }
        // For other errors, continue to fallback
        console.log('Health check failed, trying settings fallback:', healthError)
      }
      
      // Fallback to public settings
      const settingsResponse = await api.getPublicSettings()
      
      if (settingsResponse.success && settingsResponse.data) {
        const data = settingsResponse.data as any
        const maintenanceMode = data.maintenance_mode
        const message = data.maintenance_message
        
        setIsMaintenanceMode(maintenanceMode === true)
        setMaintenanceMessage(message || "We are currently undergoing maintenance. Please check back soon.")
      }
    } catch (error) {
      console.error("Failed to check maintenance status:", error)
      // Don't show maintenance mode on error, assume service is available
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking service status...</p>
        </div>
      </div>
    )
  }

  if (isMaintenanceMode) {
    return (
      <MaintenancePage message={maintenanceMessage} />
    )
  }

  return <>{children}</>
}
