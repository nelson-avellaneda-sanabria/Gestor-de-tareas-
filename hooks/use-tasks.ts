'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Task, Priority, FilterType, SortType } from '@/types/task'

const STORAGE_KEY = 'task-manager-tasks'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar tareas desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setTasks(JSON.parse(stored))
      } catch {
        setTasks([])
      }
    }
    setIsLoaded(true)
  }, [])

  // Guardar tareas en localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks, isLoaded])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completed: false,
    }
    setTasks(prev => [newTask, ...prev])
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }, [])

  const getFilteredAndSortedTasks = useCallback(
    (filter: FilterType, sort: SortType, search: string, priorityFilter: Priority | 'all') => {
      let filtered = [...tasks]

      // Filtrar por estado
      if (filter === 'completed') {
        filtered = filtered.filter(task => task.completed)
      } else if (filter === 'pending') {
        filtered = filtered.filter(task => !task.completed)
      }

      // Filtrar por prioridad
      if (priorityFilter !== 'all') {
        filtered = filtered.filter(task => task.priority === priorityFilter)
      }

      // Filtrar por búsqueda
      if (search.trim()) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(
          task =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description?.toLowerCase().includes(searchLower)
        )
      }

      // Ordenar
      const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 }
      
      filtered.sort((a, b) => {
        switch (sort) {
          case 'priority':
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          case 'dueDate':
            if (!a.dueDate && !b.dueDate) return 0
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          case 'title':
            return a.title.localeCompare(b.title)
          case 'date':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
      })

      return filtered
    },
    [tasks]
  )

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    progress: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0,
  }

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getFilteredAndSortedTasks,
    stats,
  }
}
