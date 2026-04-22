'use client'

import { motion } from 'framer-motion'
import { format, isPast, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import { Check, Pencil, Trash2, Calendar, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'

interface TaskItemProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const priorityConfig = {
    low: {
      color: 'bg-emerald-500',
      border: 'border-l-emerald-500',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      label: 'Baja',
    },
    medium: {
      color: 'bg-amber-500',
      border: 'border-l-amber-500',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      label: 'Media',
    },
    high: {
      color: 'bg-rose-500',
      border: 'border-l-rose-500',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      label: 'Alta',
    },
  }

  const config = priorityConfig[task.priority]

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'group relative bg-card border border-border rounded-xl p-4 transition-all duration-200',
        'hover:shadow-md hover:border-primary/20',
        'border-l-4',
        config.border,
        task.completed && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={cn(
            'mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
            task.completed
              ? 'bg-primary border-primary text-primary-foreground'
              : 'border-muted-foreground/40 hover:border-primary'
          )}
        >
          {task.completed && <Check className="h-3 w-3" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-medium text-foreground transition-all duration-200',
              task.completed && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className={cn(
              'text-sm text-muted-foreground mt-1 line-clamp-2',
              task.completed && 'line-through'
            )}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Priority badge */}
            <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', config.badge)}>
              <Flag className="h-3 w-3" />
              {config.label}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full flex items-center gap-1',
                  isOverdue
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : isDueToday
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Calendar className="h-3 w-3" />
                {isOverdue ? 'Vencida: ' : isDueToday ? 'Hoy: ' : ''}
                {format(new Date(task.dueDate), 'd MMM', { locale: es })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task)}
            className="h-8 w-8 text-muted-foreground hover:text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
