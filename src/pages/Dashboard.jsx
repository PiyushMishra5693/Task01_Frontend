import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import { tasksAPI } from '../services/api'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({ status: 'all', search: '' })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchTasks()
  }, [filters])

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks(filters)
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData)
      fetchTasks()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await tasksAPI.updateTask(taskId, taskData)
      fetchTasks()
      setEditingTask(null)
      setShowForm(false)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(taskId)
        fetchTasks()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Task Tracker</h1>
              <span className="ml-4 text-gray-600">Welcome, {user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setEditingTask(null)
                  setShowForm(!showForm)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                {showForm ? 'Cancel' : '+ Add Task'}
              </button>
            </div>

            {/* Filters */}
            <div className="flex space-x-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Task Form */}
          {showForm && (
            <div className="mb-6">
              <TaskForm
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                initialData={editingTask}
                onCancel={() => {
                  setShowForm(false)
                  setEditingTask(null)
                }}
              />
            </div>
          )}

          {/* Task List */}
          <TaskList
            tasks={tasks}
            onEdit={(task) => {
              setEditingTask(task)
              setShowForm(true)
            }}
            onDelete={handleDeleteTask}
          />
        </div>
      </main>
    </div>
  )
}

export default Dashboard