"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { TabletSmartphone } from "lucide-react"

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const userAgent = window.navigator.userAgent
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true

    setIsIOS(isIOSDevice)
    setIsStandalone(standalone)

    const beforeInstallPromptHandler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler)

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler)
    }
  }, [])

  if (isStandalone) return null

  const handleInstallClick = () => {
    if (isIOS) {
      setDialogOpen(true)
    } else if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null)
      })
    } else {
      alert("Use your browser's menu to install the app to your home screen.")
    }
  }

  return (
    <>

      <Button onClick={handleInstallClick} className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <TabletSmartphone className="mr-2 h-4 w-4" />Install App
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install this App</DialogTitle>
            <DialogDescription>
              To install this app on your iOS device:
              <ol className="mt-2 list-decimal list-inside space-y-1 text-sm">
                <li>Tap the Share button <span role="img" aria-label="share icon">⎋</span></li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              </ol>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}