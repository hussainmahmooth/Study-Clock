import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(initialSeconds, onComplete, settings) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsPaused(false)
            if (settings && settings.soundEnabled) {
              playAlertSound()
            }
            // Call onComplete after a small delay to ensure state is updated
            setTimeout(() => {
              if (onComplete) {
                onComplete()
              }
            }, 100)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused, onComplete, settings])

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error('Error playing sound:', e))
    } else {
      // Create audio context for beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }

  const start = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  const pause = useCallback(() => {
    setIsPaused(true)
    setIsRunning(false)
  }, [])

  const reset = useCallback((newSeconds) => {
    setIsRunning(false)
    setIsPaused(false)
    setSeconds(newSeconds !== undefined ? newSeconds : initialSeconds)
  }, [initialSeconds])

  const resume = useCallback(() => {
    setIsPaused(false)
    setIsRunning(true)
  }, [])

  const setTime = useCallback((newSeconds) => {
    setSeconds(newSeconds)
  }, [])

  return {
    seconds,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    setTime,
  }
}

