'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTasks } from '@/hooks/use-tasks'
import { TaskForm } from './task-form'
import { TaskItem } from './task-item'
import { TaskFilters } from './task-filters'
import { ProgressBar } from './progress-bar'
import { DeleteModal } from './delete-modal'
import { EmptyState } from './empty-state'
import type { Task, FilterType, SortType, Priority } from '@/types/task'

export function TaskManager() {
  const {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getFilteredAndSortedTasks,
    stats,
  } = useTasks()

  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('date')
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  const filteredTasks = getFilteredAndSortedTasks(filter, sort, search, priorityFilter)

  const handleSubmit = (taskData: { title: string; description?: string; priority: Priority; dueDate?: string }) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
      setEditingTask(null)
    } else {
      addTask(taskData)
    }
  }

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id)
      setTaskToDelete(null)
    }
  }

  const getEmptyStateType = (): 'no-tasks' | 'no-results' | 'all-complete' => {
    if (tasks.length === 0) return 'no-tasks'
    if (filteredTasks.length === 0) {
      if (filter === 'pending' && stats.pending === 0) return 'all-complete'
      return 'no-results'
    }
    return 'no-tasks'
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Gestor de Tareas
        </h1>
        <p className="text-muted-foreground">
          Organiza tu día de manera eficiente
        </p>
      </div>

      {/* Progress */}
      {tasks.length > 0 && <ProgressBar stats={stats} />}

      {/* Form */}
      <TaskForm
        onSubmit={handleSubmit}
        editingTask={editingTask}
        onCancelEdit={() => setEditingTask(null)}
      />

      {/* Filters */}
      {tasks.length > 0 && (
        <TaskFilters
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
          search={search}
          setSearch={setSearch}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
      )}

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={toggleComplete}
              onEdit={setEditingTask}
              onDelete={setTaskToDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && <EmptyState type={getEmptyStateType()} />}

      {/* Delete Modal */}
      <DeleteModal
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  )
}
