import React, { useState } from 'react'

function Settings({ settings, updateSettings, onExport }) {
  const [localSettings, setLocalSettings] = useState(settings)

  const handleChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    updateSettings(newSettings)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target.result)
          if (config.settings) {
            setLocalSettings(config.settings)
            updateSettings(config.settings)
          }
          alert('Settings imported successfully!')
        } catch (error) {
          alert('Error importing settings: ' + error.message)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Settings
        </h2>

        <div className="space-y-6">
          {/* Timer Settings */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Timer Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Study Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localSettings.studyDuration}
                  onChange={(e) => handleChange('studyDuration', parseInt(e.target.value) || 25)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.breakDuration}
                  onChange={(e) => handleChange('breakDuration', parseInt(e.target.value) || 5)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Long Break Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakDuration}
                  onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value) || 15)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sessions Until Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={localSettings.sessionsUntilLongBreak}
                  onChange={(e) => handleChange('sessionsUntilLongBreak', parseInt(e.target.value) || 4)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Alert Settings */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Alert Settings
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Enable Sound Alerts
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.visualAlerts}
                  onChange={(e) => handleChange('visualAlerts', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Enable Visual Alerts
                </span>
              </label>
            </div>
          </section>

          {/* Background Music */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Background Music
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.backgroundMusic}
                  onChange={(e) => handleChange('backgroundMusic', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Enable Background Music
                </span>
              </label>
              {localSettings.backgroundMusic && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Music Volume: {Math.round(localSettings.musicVolume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={localSettings.musicVolume}
                    onChange={(e) => handleChange('musicVolume', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Keyboard Shortcuts
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Toggle Theme</span>
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Ctrl/Cmd + T</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Play/Pause Timer</span>
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Switch to Timer</span>
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">1</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Switch to Tasks</span>
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">2</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Switch to Timeline</span>
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">3</kbd>
              </div>
            </div>
          </section>

          {/* Import/Export */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Data Management
            </h3>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={onExport}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Export Configuration
              </button>
              <label className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                Import Configuration
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Export or import your settings, tasks, timeline, and analytics data.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Settings

