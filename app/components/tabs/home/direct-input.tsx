"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader, Mic, Send } from "lucide-react"

type Props = {
    inputText: string
    setInputText: (value: string) => void
    onSubmit: () => Promise<void>
}

export default function DirectInput({ inputText, setInputText, onSubmit }: Props) {
    const [isRecording, setIsRecording] = useState(false)
    const [showRecordingPopup, setShowRecordingPopup] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [recordingTime, setRecordingTime] = useState(20)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const popupRef = useRef<HTMLDivElement | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const stopRecording = (reason: "manual" | "timeout" | "cancel") => {
      if (!mediaRecorderRef.current) return
      if (reason === "cancel") {
        setShowRecordingPopup(false)
        setIsRecording(false)
        clearTimeout(timeoutRef.current!)
        clearInterval(intervalRef.current!)
        return
      }
      mediaRecorderRef.current.stop()
      clearTimeout(timeoutRef.current!)
      clearInterval(intervalRef.current!)
    }

    const handleMicClick = async () => {
      if (isRecording) {
        stopRecording("manual")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        clearInterval(intervalRef.current!)
        clearTimeout(timeoutRef.current!)

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const file = new File([audioBlob], "voice-input.webm", { type: "audio/webm" })

        const formData = new FormData()
        formData.append("audio", file)

        setIsProcessing(true)
        setShowRecordingPopup(false)
        setIsRecording(false)

        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        setInputText(data.text || "")
        setIsProcessing(false)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setShowRecordingPopup(true)
      setRecordingTime(20)
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev - 1)
      }, 1000)

      timeoutRef.current = setTimeout(() => {
        stopRecording("timeout")
      }, 20000)
    }

    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
          stopRecording("cancel")
        }
      }
      if (showRecordingPopup) {
        document.addEventListener("mousedown", handleOutsideClick)
      } else {
        document.removeEventListener("mousedown", handleOutsideClick)
      }
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick)
      }
    }, [showRecordingPopup])

    const isDisabled = !inputText.trim() || isSubmitting

    return (
        <>
            <Card className="border-none p-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Add expense (e.g., Coffee ¥450)"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 shrink-0"
                        aria-label="Voice input"
                        onClick={handleMicClick}
                    >
                        <Mic className="h-5 w-5 animate-pulse" />
                    </Button>
                    <Button
                        type="button"
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        disabled={isDisabled}
                        onClick={async () => {
                            setIsSubmitting(true)
                            await onSubmit()
                            setIsSubmitting(false)
                          }}
                        aria-label="Send"
                        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                    >
                        {isSubmitting ? (
                            <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-muted rounded-full" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </Card>
            {showRecordingPopup && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={handleMicClick}>
                <div className="bg-white px-6 py-5 rounded shadow-lg text-center space-y-2 animate-in fade-in zoom-in max-w-xs w-full cursor-pointer" ref={popupRef}>
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Mic className="h-8 w-8 text-gray-500 animate-pulse" />
                    <p className="text-lg font-semibold">Say something</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Example: "I bought coffee for 3 dollars"</p>
                  <div className="relative h-2 w-full bg-gray-200 rounded overflow-hidden mt-2">
                    <div
                      className="absolute left-0 top-0 h-full bg-gray-500 transition-all"
                      style={{ width: `${(recordingTime / 20) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{recordingTime}s • tap to stop</p>
                </div>
              </div>
            )}
            {isProcessing && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white px-6 py-4 rounded shadow-lg text-center space-y-2 animate-in fade-in zoom-in">
                    <div className="flex items-center justify-center">
                        <Loader className="mr-2 animate-spin" />
                        <p className="text-lg font-semibold">Processing...</p>
                    </div>
                  <p className="text-sm text-muted-foreground">Transcribing your audio</p>
                </div>
              </div>
            )}
        </>
    )
}
