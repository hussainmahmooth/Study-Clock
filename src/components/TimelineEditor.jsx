import React, { useState, useRef, useEffect } from 'react'

function TimelineEditor({ timeline, setTimeline, settings }) {
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', duration: 25, type: 'study' })
  const timelineRef = useRef(null)

  const totalDuration = timeline.reduce((sum, seg) => sum + seg.duration, 0)

  const addSegment = () => {
    const newSegment = {
      id: Date.now(),
      name: `Segment ${timeline.length + 1}`,
      duration: 25,
      type: 'study',
      order: timeline.length,
    }
    setTimeline([...timeline, newSegment])
  }

  const deleteSegment = (index) => {
    setTimeline(timeline.filter((_, i) => i !== index))
  }

  const startEdit = (index) => {
    setEditingIndex(index)
    setEditForm({
      name: timeline[index].name,
      duration: timeline[index].duration,
      type: timeline[index].type || 'study',
    })
  }

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updated = [...timeline]
      updated[editingIndex] = {
        ...updated[editingIndex],
        ...editForm,
      }
      setTimeline(updated)
      setEditingIndex(null)
      setEditForm({ name: '', duration: 25, type: 'study' })
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditForm({ name: '', duration: 25, type: 'study' })
  }

  const handleDragStart = (e, index) => {
    setDraggingIndex(index)
    const rect = timelineRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset(e.clientX - rect.left)
    }
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', '')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggingIndex === null || draggingIndex === dropIndex) {
      setDraggingIndex(null)
      return
    }

    const newTimeline = [...timeline]
    const draggedItem = newTimeline[draggingIndex]
    newTimeline.splice(draggingIndex, 1)
    newTimeline.splice(dropIndex, 0, draggedItem)

    setTimeline(newTimeline)
    setDraggingIndex(null)
  }

  const handleMouseDown = (e, index) => {
    const startX = e.clientX
    const startIndex = index
    let currentIndex = index

    const handleMouseMove = (e) => {
      if (!timelineRef.current) return

      const rect = timelineRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const segmentWidth = rect.width / timeline.length
      const newIndex = Math.max(0, Math.min(timeline.length - 1, Math.floor(x / segmentWidth)))

      if (newIndex !== currentIndex) {
        currentIndex = newIndex
        const newTimeline = [...timeline]
        const draggedItem = newTimeline[startIndex]
        newTimeline.splice(startIndex, 1)
        newTimeline.splice(newIndex, 0, draggedItem)
        setTimeline(newTimeline)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const exportTimeline = () => {
    const config = {
      timeline,
      totalDuration,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `study-timeline-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Timeline Editor
          </h2>
          <div className="flex gap-2">
            <button
              onClick={addSegment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + Add Segment
            </button>
            <button
              onClick={exportTimeline}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Export Timeline
            </button>
          </div>
        </div>

        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Total Duration:</strong> {totalDuration} minutes ({Math.floor(totalDuration / 60)}h {totalDuration % 60}m)
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Drag segments to reorder • Click to edit • Delete to remove
          </p>
        </div>

        {timeline.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No segments yet. Create your first segment to get started!
            </p>
            <button
              onClick={addSegment}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Segment
            </button>
          </div>
        ) : (
          <div
            ref={timelineRef}
            className="relative bg-gray-100 dark:bg-gray-700 rounded-lg p-4 min-h-[200px]"
            onDragOver={handleDragOver}
          >
            {/* Visual Timeline Bar */}
            <div className="mb-6 relative h-16 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
              {timeline.map((segment, index) => {
                const width = (segment.duration / totalDuration) * 100
                const offset = timeline
                  .slice(0, index)
                  .reduce((sum, seg) => sum + (seg.duration / totalDuration) * 100, 0)
                
                return (
                  <div
                    key={segment.id || index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onMouseDown={(e) => handleMouseDown(e, index)}
                    className={`absolute h-full cursor-move transition-all hover:opacity-80 ${
                      segment.type === 'study'
                        ? 'bg-blue-500'
                        : segment.type === 'break'
                        ? 'bg-green-500'
                        : 'bg-purple-500'
                    }`}
                    style={{
                      left: `${offset}%`,
                      width: `${width}%`,
                    }}
                    title={`${segment.name} (${segment.duration}m)`}
                  >
                    <div className="h-full flex items-center justify-center text-white text-xs font-medium p-1 overflow-hidden">
                      <span className="truncate">{segment.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Segment List */}
            <div className="space-y-3">
              {timeline.map((segment, index) => (
                <div
                  key={segment.id || index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    editingIndex === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }`}
                >
                  {editingIndex === index ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Segment name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <div className="flex gap-3 flex-wrap">
                        <input
                          type="number"
                          min="1"
                          value={editForm.duration}
                          onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) || 1 })}
                          placeholder="Duration (minutes)"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={editForm.type}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="study">Study</option>
                          <option value="break">Break</option>
                          <option value="long-break">Long Break</option>
                        </select>
                        <button
                          onClick={saveEdit}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div
                          className={`w-4 h-4 rounded ${
                            segment.type === 'study'
                              ? 'bg-blue-500'
                              : segment.type === 'break'
                              ? 'bg-green-500'
                              : 'bg-purple-500'
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                            {segment.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {segment.duration} minutes • {segment.type || 'study'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(index)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          aria-label={`Edit segment "${segment.name}"`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSegment(index)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          aria-label={`Delete segment "${segment.name}"`}
                        >
                          Delete
                        </button>
                        <div className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 cursor-move" title="Drag to reorder">
                          ⋮⋮
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TimelineEditor

