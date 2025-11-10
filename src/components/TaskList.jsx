import React, { useState } from 'react'

function TaskList({ tasks, setTasks, onTaskComplete }) {
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        pomodoros: 1,
        completedPomodoros: 0,
      }
      setTasks([...tasks, task])
      setNewTask('')
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const wasCompleted = task.completed
        const newCompleted = !task.completed
        if (!wasCompleted && newCompleted && onTaskComplete) {
          onTaskComplete()
        }
        return { ...task, completed: newCompleted }
      }
      return task
    }))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const updatePomodoros = (id, pomodoros) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, pomodoros: Math.max(1, pomodoros) } : task
    ))
  }

  const incrementCompletedPomodoros = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCount = task.completedPomodoros + 1
        const isNowCompleted = newCount >= task.pomodoros
        return {
          ...task,
          completedPomodoros: newCount,
          completed: isNowCompleted,
        }
      }
      return task
    }))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const activeTasks = tasks.filter(t => !t.completed).length
  const completedTasks = tasks.filter(t => t.completed).length
  const totalProgress = tasks.length > 0
    ? (completedTasks / tasks.length) * 100
    : 0

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Task List
        </h2>

        {/* Progress Summary */}
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedTasks} / {tasks.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
              role="progressbar"
              aria-valuenow={totalProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        {/* Add Task */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="New task input"
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Add task"
          >
            Add
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {f} ({f === 'all' ? tasks.length : f === 'active' ? activeTasks : completedTasks})
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No tasks {filter !== 'all' ? `(${filter})` : ''}. Add one above!
            </p>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  task.completed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  />
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        task.completed
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {task.text}
                    </p>
                    <div className="mt-2 flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Pomodoros:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={task.pomodoros}
                          onChange={(e) => updatePomodoros(task.id, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                          disabled={task.completed}
                        />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Completed: {task.completedPomodoros} / {task.pomodoros}
                      </div>
                      <button
                        onClick={() => incrementCompletedPomodoros(task.id)}
                        disabled={task.completed}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        +1 Pomodoro
                      </button>
                      <div className="flex-1"></div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        aria-label={`Delete task "${task.text}"`}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(task.completedPomodoros / task.pomodoros) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskList

