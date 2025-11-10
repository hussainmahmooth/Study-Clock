import React, { useState, useEffect } from 'react'
import Timer from './components/Timer'
import TaskList from './components/TaskList'
import TimelineEditor from './components/TimelineEditor'
import Settings from './components/Settings'
import Analytics from './components/Analytics'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false)
  const [activeTab, setActiveTab] = useState('timer')
  const [settings, setSettings] = useLocalStorage('studyClockSettings', {
    studyDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    soundEnabled: true,
    visualAlerts: true,
    backgroundMusic: false,
    musicVolume: 0.3,
  })
  const [tasks, setTasks] = useLocalStorage('studyClockTasks', [])
  const [timeline, setTimeline] = useLocalStorage('studyClockTimeline', [])
  const [analytics, setAnalytics] = useLocalStorage('studyClockAnalytics', {
    totalStudyTime: 0,
    sessionsCompleted: 0,
    tasksCompleted: 0,
    dailyStats: {},
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useKeyboardShortcuts({
    toggleTheme: () => setDarkMode(!darkMode),
    focusTimer: () => setActiveTab('timer'),
    focusTasks: () => setActiveTab('tasks'),
    focusTimeline: () => setActiveTab('timeline'),
    focusAnalytics: () => setActiveTab('analytics'),
    focusSettings: () => setActiveTab('settings'),
    space: () => {
      // Space key handling will be managed by Timer component
    },
  })

  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings })
  }

  const updateAnalytics = (updates) => {
    setAnalytics(prev => {
      const today = new Date().toISOString().split('T')[0]
      const todayStats = prev.dailyStats[today] || { studyTime: 0, sessions: 0, tasksCompleted: 0 }
      
      return {
        ...prev,
        totalStudyTime: updates.totalStudyTime !== undefined ? updates.totalStudyTime : prev.totalStudyTime,
        sessionsCompleted: updates.sessionsCompleted !== undefined ? updates.sessionsCompleted : prev.sessionsCompleted,
        tasksCompleted: updates.tasksCompleted !== undefined ? updates.tasksCompleted : prev.tasksCompleted,
        dailyStats: {
          ...prev.dailyStats,
          [today]: {
            studyTime: (todayStats.studyTime || 0) + (updates.studyTime || 0),
            sessions: (todayStats.sessions || 0) + (updates.sessions || 0),
            tasksCompleted: (todayStats.tasksCompleted || 0) + (updates.tasksCompleted || 0),
          },
        },
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              ⏰ Study Clock
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
            {[
              { id: 'timer', label: 'Timer' },
              { id: 'tasks', label: 'Tasks' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'settings', label: 'Settings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={`Switch to ${tab.label} tab`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'timer' && (
          <Timer
            settings={settings}
            tasks={tasks}
            timeline={timeline}
            onSessionComplete={(time) => updateAnalytics({
              totalStudyTime: analytics.totalStudyTime + time,
              sessionsCompleted: analytics.sessionsCompleted + 1,
              studyTime: time,
              sessions: 1,
            })}
          />
        )}
        {activeTab === 'tasks' && (
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            onTaskComplete={() => updateAnalytics({
              tasksCompleted: analytics.tasksCompleted + 1,
            })}
          />
        )}
        {activeTab === 'timeline' && (
          <TimelineEditor
            timeline={timeline}
            setTimeline={setTimeline}
            settings={settings}
          />
        )}
        {activeTab === 'analytics' && (
          <Analytics analytics={analytics} />
        )}
        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            updateSettings={updateSettings}
            onExport={() => {
              const config = {
                settings,
                tasks,
                timeline,
                analytics,
                exportedAt: new Date().toISOString(),
              }
              const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `study-clock-config-${Date.now()}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
          />
        )}
      </main>
    </div>
  )
}

export default App

