# Study Clock - Pomodoro Timer

A responsive, feature-rich Pomodoro-style study clock built with React and Tailwind CSS. Perfect for students and professionals who want to manage their study sessions effectively.

## Features

### Core Timer Features
- ✅ **Pomodoro Timer**: Customizable study and break intervals
- ✅ **Start/Pause/Reset**: Full timer control
- ✅ **Visual Progress**: Circular progress indicator with percentage
- ✅ **Session Tracking**: Automatic session counting with long breaks

### Task Management
- ✅ **Task List**: Add, edit, and manage study tasks
- ✅ **Pomodoro Tracking**: Assign Pomodoros to tasks and track completion
- ✅ **Progress Tracking**: Visual progress bars for each task
- ✅ **Task Filtering**: Filter by all, active, or completed tasks

### Advanced Timeline Editor
- ✅ **Draggable Timeline**: Create and edit multiple timed segments
- ✅ **Visual Timeline**: Drag-and-drop interface for reordering segments
- ✅ **Segment Types**: Support for study, break, and long break segments
- ✅ **Timeline Export**: Export timeline configurations as JSON

### Alerts & Notifications
- ✅ **Audio Alerts**: Sound notifications when timer completes
- ✅ **Visual Alerts**: Pulsing animation when timer finishes
- ✅ **Background Music**: Optional ambient focus music (Web Audio API)
- ✅ **Customizable Volume**: Adjust music volume to your preference

### Themes & Customization
- ✅ **Dark/Light Mode**: Toggle between themes with persistent storage
- ✅ **Customizable Durations**: Adjust study, break, and long break times
- ✅ **Session Settings**: Configure sessions until long break

### Keyboard Shortcuts
- ✅ **Space**: Play/pause timer
- ✅ **Ctrl/Cmd + T**: Toggle theme
- ✅ **1-5**: Switch between tabs (Timer, Tasks, Timeline, Analytics, Settings)

### Data Management
- ✅ **Local Storage**: All data persisted in browser localStorage
- ✅ **JSON Export**: Export complete configuration (settings, tasks, timeline, analytics)
- ✅ **JSON Import**: Import previously exported configurations

### Analytics Dashboard
- ✅ **Total Study Time**: Track cumulative study time
- ✅ **Sessions Completed**: Count of completed Pomodoro sessions
- ✅ **Tasks Completed**: Track completed tasks
- ✅ **Daily Stats**: View daily study statistics
- ✅ **Weekly Overview**: 7-day statistics breakdown
- ✅ **Progress Charts**: Visual progress bars for daily activity

### Accessibility
- ✅ **ARIA Labels**: Proper accessibility labels for screen readers
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Focus Management**: Proper focus indicators
- ✅ **Semantic HTML**: Uses proper HTML elements

### Mobile-First Design
- ✅ **Responsive Layout**: Works perfectly on mobile, tablet, and desktop
- ✅ **Touch-Friendly**: Large buttons and touch targets
- ✅ **Horizontal Scrolling**: Smooth scrolling for timeline and task lists

## Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Usage

### Basic Timer
1. Go to the Timer tab
2. Click "Start" to begin a study session
3. The timer will automatically switch between study and break sessions
4. Use "Pause" to pause, "Resume" to continue, or "Reset" to restart

### Creating Tasks
1. Go to the Tasks tab
2. Enter a task name and click "Add"
3. Set the number of Pomodoros needed
4. Click "+1 Pomodoro" as you complete sessions
5. Tasks automatically complete when all Pomodoros are done

### Creating a Timeline
1. Go to the Timeline tab
2. Click "Add Segment" to create a new segment
3. Edit segments by clicking "Edit"
4. Drag segments in the visual timeline to reorder
5. Click "Start Timeline" in the Timer tab to use your timeline

### Analytics
1. Go to the Analytics tab
2. View your study statistics
3. See daily and weekly progress
4. Track your productivity over time

### Settings
1. Go to the Settings tab
2. Adjust timer durations
3. Enable/disable alerts and music
4. Export or import your configuration
5. View keyboard shortcuts

## Configuration Export/Import

### Export
1. Go to Settings
2. Click "Export Configuration"
3. A JSON file will be downloaded with all your data

### Import
1. Go to Settings
2. Click "Import Configuration"
3. Select a previously exported JSON file
4. Your settings will be restored

## Keyboard Shortcuts

- **Space**: Play/pause timer (when not typing)
- **Ctrl/Cmd + T**: Toggle dark/light theme
- **1**: Switch to Timer tab
- **2**: Switch to Tasks tab
- **3**: Switch to Timeline tab
- **4**: Switch to Analytics tab
- **5**: Switch to Settings tab

## Technology Stack

- **React**: UI framework
- **Tailwind CSS**: Styling
- **Vite**: Build tool
- **Web Audio API**: Background music and alerts
- **localStorage**: Data persistence

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Notes

- All data is stored locally in your browser
- No data is sent to any server
- Works completely offline after initial load
- Background music uses Web Audio API (may require user interaction on some browsers)

