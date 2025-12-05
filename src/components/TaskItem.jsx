const TaskItem = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <li className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
              <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>
          {task.description && (
            <p className="mt-1 text-sm text-gray-600">{task.description}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="ml-4 flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}

export default TaskItem