import { useEffect } from 'react'

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return
      }

      // Ctrl/Cmd + T for theme toggle
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't' && shortcuts.toggleTheme) {
        e.preventDefault()
        shortcuts.toggleTheme()
      }

      // Space for play/pause (when not in input)
      if (e.key === ' ' && shortcuts.space) {
        e.preventDefault()
        shortcuts.space()
      }

      // Number keys for tabs (1-5)
      if (e.key === '1' && shortcuts.focusTimer) {
        e.preventDefault()
        shortcuts.focusTimer()
      }
      if (e.key === '2' && shortcuts.focusTasks) {
        e.preventDefault()
        shortcuts.focusTasks()
      }
      if (e.key === '3' && shortcuts.focusTimeline) {
        e.preventDefault()
        shortcuts.focusTimeline()
      }
      if (e.key === '4' && shortcuts.focusAnalytics) {
        e.preventDefault()
        shortcuts.focusAnalytics()
      }
      if (e.key === '5' && shortcuts.focusSettings) {
        e.preventDefault()
        shortcuts.focusSettings()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

