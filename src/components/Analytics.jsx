import React from 'react'

function Analytics({ analytics }) {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const today = new Date().toISOString().split('T')[0]
  const todayStats = analytics.dailyStats[today] || {
    studyTime: 0,
    sessions: 0,
    tasksCompleted: 0,
  }

  const weeklyStats = Object.entries(analytics.dailyStats)
    .filter(([date]) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(date) >= weekAgo
    })
    .reduce((acc, [_, stats]) => {
      return {
        studyTime: acc.studyTime + (stats.studyTime || 0),
        sessions: acc.sessions + (stats.sessions || 0),
        tasksCompleted: acc.tasksCompleted + (stats.tasksCompleted || 0),
      }
    }, { studyTime: 0, sessions: 0, tasksCompleted: 0 })

  const averageSessionTime = analytics.sessionsCompleted > 0
    ? Math.round(analytics.totalStudyTime / analytics.sessionsCompleted / 60)
    : 0

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Analytics Dashboard
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
              Total Study Time
            </h3>
            <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
              {formatTime(analytics.totalStudyTime)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
              Sessions Completed
            </h3>
            <p className="text-3xl font-bold text-green-800 dark:text-green-200">
              {analytics.sessionsCompleted}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
            <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
              Tasks Completed
            </h3>
            <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
              {analytics.tasksCompleted}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border-2 border-orange-200 dark:border-orange-800">
            <h3 className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">
              Avg Session Time
            </h3>
            <p className="text-3xl font-bold text-orange-800 dark:text-orange-200">
              {averageSessionTime}m
            </p>
          </div>
        </div>

        {/* Today's Stats */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Today's Progress
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Study Time
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {formatTime(todayStats.studyTime || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Sessions
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {todayStats.sessions || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Tasks Completed
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {todayStats.tasksCompleted || 0}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Stats */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Last 7 Days
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Study Time
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {formatTime(weeklyStats.studyTime)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Sessions
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {weeklyStats.sessions}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Tasks Completed
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {weeklyStats.tasksCompleted}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Breakdown */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Daily Breakdown (Last 7 Days)
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            {Object.entries(analytics.dailyStats)
              .filter(([date]) => {
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return new Date(date) >= weekAgo
              })
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .map(([date, stats]) => {
                const dateObj = new Date(date)
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
                const maxTime = Math.max(
                  ...Object.values(analytics.dailyStats).map(s => s.studyTime || 0),
                  1
                )
                const barWidth = ((stats.studyTime || 0) / maxTime) * 100

                return (
                  <div key={date} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                          {dayName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {dateObj.toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {formatTime(stats.studyTime || 0)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>{stats.sessions || 0} sessions</span>
                      <span>{stats.tasksCompleted || 0} tasks</span>
                    </div>
                  </div>
                )
              })}
            {Object.keys(analytics.dailyStats).filter(date => {
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return new Date(date) >= weekAgo
            }).length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No data for the last 7 days
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Analytics

