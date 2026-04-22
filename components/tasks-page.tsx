'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter,
  SortAsc,
  ListTodo,
  X
} from 'lucide-react'
import { useTasksContext } from '@/context/tasks-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TaskFormModal } from './task-form-modal'
import { TaskCard } from './task-card'
import { DeleteModal } from './delete-modal'
import type { Task, FilterType, SortType, Priority } from '@/types/task'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

const filterLabels: Record<FilterType, string> = {
  all: 'Todas',
  completed: 'Completadas',
  pending: 'Pendientes',
}

const sortLabels: Record<SortType, string> = {
  date: 'Fecha de creacion',
  priority: 'Prioridad',
  dueDate: 'Fecha limite',
  title: 'Titulo',
}

const priorityLabels: Record<Priority | 'all', string> = {
  all: 'Todas',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}

export function TasksPage() {
  const { getFilteredAndSortedTasks, stats, deleteTask } = useTasksContext()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('date')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  const filteredTasks = getFilteredAndSortedTasks(filter, sort, search, priorityFilter)

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id)
      setTaskToDelete(null)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setFilter('all')
    setPriorityFilter('all')
    setSort('date')
  }

  const hasActiveFilters = search || filter !== 'all' || priorityFilter !== 'all' || sort !== 'date'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Tareas</h1>
          <p className="text-muted-foreground mt-1">
            {stats.pending} pendientes, {stats.completed} completadas
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          Nueva Tarea
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tareas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-secondary border-border">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Estado:</span> {filterLabels[filter]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(filterLabels) as FilterType[]).map((f) => (
              <DropdownMenuItem key={f} onClick={() => setFilter(f)}>
                {filterLabels[f]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-secondary border-border">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Prioridad:</span> {priorityLabels[priorityFilter]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filtrar por prioridad</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(priorityLabels) as (Priority | 'all')[]).map((p) => (
              <DropdownMenuItem key={p} onClick={() => setPriorityFilter(p)}>
                {priorityLabels[p]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-secondary border-border">
              <SortAsc className="w-4 h-4" />
              <span className="hidden sm:inline">Ordenar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(sortLabels) as SortType[]).map((s) => (
              <DropdownMenuItem key={s} onClick={() => setSort(s)}>
                {sortLabels[s]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters} className="text-muted-foreground">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <ListTodo className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                {search || filter !== 'all' || priorityFilter !== 'all'
                  ? 'No se encontraron tareas'
                  : 'No hay tareas'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {search || filter !== 'all' || priorityFilter !== 'all'
                  ? 'Intenta con otros filtros'
                  : 'Comienza agregando tu primera tarea'}
              </p>
              {!search && filter === 'all' && priorityFilter === 'all' && (
                <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Crear tarea
                </Button>
              )}
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={setTaskToDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        task={editingTask}
      />

      <DeleteModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title || ''}
      />
    </motion.div>
  )
}
