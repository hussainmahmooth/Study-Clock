import React, { useState, useEffect, useRef } from 'react'
import { useTimer } from '../hooks/useTimer'

function Timer({ settings, tasks, timeline, onSessionComplete }) {
  const [sessionType, setSessionType] = useState('study') // 'study' or 'break'
  const [sessionCount, setSessionCount] = useState(0)
  const [currentSegment, setCurrentSegment] = useState(null)
  const [useTimeline, setUseTimeline] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  
  const studySeconds = settings.studyDuration * 60
  const breakSeconds = settings.breakDuration * 60
  const longBreakSeconds = settings.longBreakDuration * 60
  
  const currentDuration = sessionType === 'study' 
    ? studySeconds 
    : sessionCount % settings.sessionsUntilLongBreak === 0 
      ? longBreakSeconds 
      : breakSeconds

  const initialTime = currentSegment 
    ? currentSegment.duration * 60 
    : currentDuration

  const timerControlsRef = useRef(null)
  const handleCompleteRef = useRef(null)

  const {
    seconds,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    setTime,
  } = useTimer(initialTime, () => handleCompleteRef.current?.(), settings)

  timerControlsRef.current = { reset, setTime }

  useEffect(() => {
    handleCompleteRef.current = () => {
      if (useTimeline && timeline.length > 0) {
        // Load next timeline segment
        const currentIndex = timeline.findIndex(seg => currentSegment && seg.id === currentSegment.id)
        const nextIndex = currentIndex + 1 >= timeline.length ? 0 : currentIndex + 1
        const nextSegment = timeline[nextIndex]
        
        setCurrentSegment(nextSegment)
        const nextDuration = nextSegment.duration * 60
        if (timerControlsRef.current) {
          timerControlsRef.current.setTime(nextDuration)
          timerControlsRef.current.reset(nextDuration)
        }
        return
      }

      // Regular Pomodoro flow
      if (sessionType === 'study') {
        const newCount = sessionCount + 1
        setSessionCount(newCount)
        setSessionType('break')
        const breakTime = newCount % settings.sessionsUntilLongBreak === 0 
          ? longBreakSeconds 
          : breakSeconds
        setTimeout(() => {
          if (timerControlsRef.current) {
            timerControlsRef.current.reset(breakTime)
          }
          if (onSessionComplete) {
            onSessionComplete(studySeconds)
          }
        }, 200)
      } else {
        setSessionType('study')
        setTimeout(() => {
          if (timerControlsRef.current) {
            timerControlsRef.current.reset(studySeconds)
          }
        }, 200)
      }
    }
  }, [useTimeline, timeline, currentSegment, sessionType, sessionCount, settings, studySeconds, breakSeconds, longBreakSeconds, onSessionComplete])

  const backgroundMusicRef = useRef(null)
  const visualAlertRef = useRef(null)

  useEffect(() => {
    if (settings.backgroundMusic && isRunning) {
      if (!backgroundMusicRef.current) {
        // Create a simple ambient sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 200
        oscillator.type = 'sine'
        
        gainNode.gain.value = settings.musicVolume * 0.1
        
        oscillator.start()
        backgroundMusicRef.current = { audioContext, oscillator, gainNode }
      }
    } else {
      if (backgroundMusicRef.current) {
        try {
          backgroundMusicRef.current.oscillator.stop()
          backgroundMusicRef.current.audioContext.close()
        } catch (e) {
          // Ignore errors when stopping
        }
        backgroundMusicRef.current = null
      }
    }

    return () => {
      if (backgroundMusicRef.current) {
        try {
          backgroundMusicRef.current.oscillator.stop()
          backgroundMusicRef.current.audioContext.close()
        } catch (e) {
          // Ignore errors
        }
      }
    }
  }, [settings.backgroundMusic, isRunning, settings.musicVolume])

  useEffect(() => {
    if (settings.visualAlerts && seconds === 0 && !isRunning && !isPaused) {
      if (visualAlertRef.current) {
        visualAlertRef.current.classList.add('animate-pulse-slow')
        setTimeout(() => {
          if (visualAlertRef.current) {
            visualAlertRef.current.classList.remove('animate-pulse-slow')
          }
        }, 3000)
      }
    }
  }, [seconds, isRunning, isPaused, settings.visualAlerts])


  function handleStartTimeline() {
    if (timeline && timeline.length > 0) {
      setUseTimeline(true)
      const firstSegment = timeline[0]
      setCurrentSegment(firstSegment)
      const duration = firstSegment.duration * 60
      setTime(duration)
      reset(duration)
      start()
    }
  }

  function handleReset() {
    if (useTimeline && currentSegment) {
      reset(currentSegment.duration * 60)
    } else {
      reset(currentDuration)
    }
  }

  // Update timer when duration changes
  useEffect(() => {
    if (!isRunning && !isPaused) {
      if (useTimeline && currentSegment) {
        setTime(currentSegment.duration * 60)
        reset(currentSegment.duration * 60)
      } else {
        setTime(currentDuration)
        reset(currentDuration)
      }
    }
  }, [sessionType, sessionCount, currentSegment, useTimeline])

  // Keyboard shortcut for space bar
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ' && (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')) {
        e.preventDefault()
        if (isRunning) {
          pause()
        } else if (isPaused) {
          resume()
        } else {
          start()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isRunning, isPaused, start, pause, resume])

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentDurationForProgress = currentSegment 
    ? currentSegment.duration * 60 
    : currentDuration
  const progress = currentDurationForProgress > 0 
    ? ((currentDurationForProgress - seconds) / currentDurationForProgress) * 100 
    : 0

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {useTimeline && currentSegment 
              ? currentSegment.name 
              : sessionType === 'study' 
                ? 'Study Session' 
                : sessionCount % settings.sessionsUntilLongBreak === 0 
                  ? 'Long Break' 
                  : 'Break'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Session {sessionCount + 1}
          </p>
        </div>

        <div 
          ref={visualAlertRef}
          className="relative mx-auto w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl transition-all duration-300"
          role="timer"
          aria-label={`${sessionType} timer, ${formatTime(seconds)} remaining`}
          aria-live="polite"
        >
          <div className="absolute inset-0 rounded-full border-8 border-white dark:border-gray-700"></div>
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="relative z-10 text-center">
            <div className="text-5xl md:text-6xl font-bold text-white">
              {formatTime(seconds)}
            </div>
            <div className="text-sm text-white/80 mt-2">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          {!isRunning && !isPaused && (
            <button
              onClick={start}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Start timer"
            >
              ▶ Start
            </button>
          )}
          {isRunning && (
            <button
              onClick={pause}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              aria-label="Pause timer"
            >
              ⏸ Pause
            </button>
          )}
          {isPaused && (
            <button
              onClick={resume}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Resume timer"
            >
              ▶ Resume
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Reset timer"
          >
            ⟳ Reset
          </button>
        </div>

        {timeline && timeline.length > 0 && !useTimeline && (
          <div className="mt-6 text-center">
            <button
              onClick={handleStartTimeline}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Timeline
            </button>
          </div>
        )}

        {useTimeline && timeline && timeline.length > 0 && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
              Timeline Progress
            </h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {timeline.map((segment, index) => {
                const isActive = currentSegment && segment.id === currentSegment.id
                const currentIndex = timeline.findIndex(seg => currentSegment && seg.id === currentSegment.id)
                const isCompleted = currentIndex > index
                return (
                  <div
                    key={segment.id || index}
                    className={`flex-shrink-0 px-3 py-2 rounded ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {segment.name} ({segment.duration}m)
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Keyboard shortcuts: Space (play/pause), Ctrl/Cmd+T (theme), 1-5 (switch tabs)</p>
        </div>
      </div>
    </div>
  )
}

export default Timer
