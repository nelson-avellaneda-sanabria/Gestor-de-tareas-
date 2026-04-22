'use client'

import { motion } from 'framer-motion'
import { Check, Calendar, Pencil, Trash2, MoreVertical } from 'lucide-react'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useTasksContext } from '@/context/tasks-context'
import type { Task } from '@/types/task'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const priorityConfig = {
  high: {
    label: 'Alta',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    dot: 'bg-red-500',
  },
  medium: {
    label: 'Media',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-500',
  },
  low: {
    label: 'Baja',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { toggleComplete } = useTasksContext()

  const getDueDateInfo = (dueDate: string) => {
    const date = new Date(dueDate)
    if (isPast(date) && !isToday(date)) {
      return { label: 'Vencida', color: 'text-destructive', isOverdue: true }
    }
    if (isToday(date)) {
      return { label: 'Hoy', color: 'text-warning', isOverdue: false }
    }
    if (isTomorrow(date)) {
      return { label: 'Manana', color: 'text-info', isOverdue: false }
    }
    return { 
      label: format(date, 'd MMM yyyy', { locale: es }), 
      color: 'text-muted-foreground',
      isOverdue: false 
    }
  }

  const priority = priorityConfig[task.priority]
  const dueInfo = task.dueDate ? getDueDateInfo(task.dueDate) : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative p-4 rounded-xl border transition-all duration-200",
        task.completed
          ? "bg-secondary/30 border-border/50"
          : "bg-card border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => toggleComplete(task.id)}
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 mt-0.5",
            task.completed
              ? "bg-primary border-primary"
              : "border-muted-foreground/30 hover:border-primary"
          )}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check className="w-3.5 h-3.5 text-primary-foreground" />
            </motion.div>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-foreground transition-all",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className={cn(
                  "text-sm mt-1 line-clamp-2",
                  task.completed ? "text-muted-foreground/50" : "text-muted-foreground"
                )}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Priority */}
            <span className={cn(
              "inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border",
              priority.color
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", priority.dot)} />
              {priority.label}
            </span>

            {/* Due Date */}
            {dueInfo && (
              <span className={cn(
                "inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-secondary",
                dueInfo.color
              )}>
                <Calendar className="w-3 h-3" />
                {dueInfo.label}
              </span>
            )}

            {/* Created Date */}
            <span className="text-xs text-muted-foreground/50 ml-auto">
              {format(new Date(task.createdAt), 'd MMM', { locale: es })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
