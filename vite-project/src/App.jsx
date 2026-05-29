import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'thiranex.todo.tasks.v1'
const FILTERS = ['all', 'active', 'completed']

function safeLoadTasks() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter((task) => task && typeof task.title === 'string')
      .map((task) => ({
        id: typeof task.id === 'string' ? task.id : crypto.randomUUID(),
        title: task.title,
        completed: Boolean(task.completed),
      }))
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState(safeLoadTasks)
  const [taskInput, setTaskInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const visibleTasks = useMemo(() => {
    if (filter === 'active') {
      return tasks.filter((task) => !task.completed)
    }

    if (filter === 'completed') {
      return tasks.filter((task) => task.completed)
    }

    return tasks
  }, [filter, tasks])

  const activeCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.length - activeCount

  function addTask(event) {
    event.preventDefault()

    const title = taskInput.trim()

    if (!title) {
      return
    }

    const newTask = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    }

    setTasks((currentTasks) => [newTask, ...currentTasks])
    setTaskInput('')
  }

  function startEditing(task) {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  function saveTask(taskId) {
    const nextTitle = editingTitle.trim()

    if (!nextTitle) {
      return
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, title: nextTitle } : task,
      ),
    )
    setEditingId(null)
    setEditingTitle('')
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingTitle('')
  }

  function handleTaskListClick(event) {
    const actionButton = event.target.closest('button[data-action]')

    if (!actionButton) {
      return
    }

    const { action, id } = actionButton.dataset

    if (action === 'toggle') {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      )
      return
    }

    if (action === 'edit') {
      const task = tasks.find((item) => item.id === id)

      if (task) {
        startEditing(task)
      }
      return
    }

    if (action === 'delete') {
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
      if (editingId === id) {
        cancelEditing()
      }
      return
    }

    if (action === 'cancel') {
      cancelEditing()
    }
  }

  function clearCompleted() {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))
    if (editingId && tasks.some((task) => task.id === editingId && task.completed)) {
      cancelEditing()
    }
  }

  return (
    <main className="todo-app">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Task studio</p>
          <h1>Build a quieter workflow.</h1>
          <p className="lede">
            Capture tasks, edit them in place, filter your focus, and keep the
            list automatically saved in local storage.
          </p>
        </div>

        <div className="hero-stats" aria-label="Task summary">
          <div>
            <span>{tasks.length}</span>
            <p>Total</p>
          </div>
          <div>
            <span>{activeCount}</span>
            <p>Active</p>
          </div>
          <div>
            <span>{completedCount}</span>
            <p>Done</p>
          </div>
        </div>
      </section>

      <section className="task-panel">
        <form className="task-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="task-input">
            Add a new task
          </label>
          <input
            id="task-input"
            type="text"
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            placeholder="Add a new task and press Enter"
            autoComplete="off"
            maxLength={120}
          />
          <button type="submit">Add task</button>
        </form>

        <div className="toolbar">
          <div className="filters" role="tablist" aria-label="Task filters">
            {FILTERS.map((option) => (
              <button
                key={option}
                type="button"
                className={option === filter ? 'filter-chip active' : 'filter-chip'}
                onClick={() => setFilter(option)}
                role="tab"
                aria-selected={option === filter}
              >
                {option[0].toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="ghost-button"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            Clear completed
          </button>
        </div>

        <ul className="task-list" onClick={handleTaskListClick}>
          {visibleTasks.length === 0 ? (
            <li className="empty-state">
              <h2>No tasks found</h2>
              <p>
                {filter === 'all'
                  ? 'Add your first task to begin.'
                  : 'Try a different filter or add more tasks.'}
              </p>
            </li>
          ) : (
            visibleTasks.map((task) => {
              const isEditing = task.id === editingId

              return (
                <li
                  key={task.id}
                  className={task.completed ? 'task-item completed' : 'task-item'}
                >
                  <button
                    type="button"
                    className="task-toggle"
                    data-action="toggle"
                    data-id={task.id}
                    aria-pressed={task.completed}
                    aria-label={task.completed ? 'Mark task as active' : 'Mark task as completed'}
                  >
                    <span />
                  </button>

                  {isEditing ? (
                    <form
                      className="edit-form"
                      onSubmit={(event) => {
                        event.preventDefault()
                        saveTask(task.id)
                      }}
                    >
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                        autoFocus
                        maxLength={120}
                        aria-label="Edit task title"
                      />
                      <button type="submit" className="primary-action">
                        Save
                      </button>
                      <button
                        type="button"
                        className="ghost-button"
                        data-action="cancel"
                        data-id={task.id}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="task-content">
                        <span className="task-title">{task.title}</span>
                        <span className="task-meta">
                          {task.completed ? 'Completed' : 'In progress'}
                        </span>
                      </div>

                      <div className="task-actions">
                        <button
                          type="button"
                          className="ghost-button"
                          data-action="edit"
                          data-id={task.id}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger-button"
                          data-action="delete"
                          data-id={task.id}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              )
            })
          )}
        </ul>
      </section>
    </main>
  )
}

export default App
