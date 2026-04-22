'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTasksContext } from '@/context/tasks-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Task, Priority } from '@/types/task'
import { cn } from '@/lib/utils'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Baja', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' },
  { value: 'medium', label: 'Media', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30' },
  { value: 'high', label: 'Alta', color: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30' },
]

export function TaskFormModal({ isOpen, onClose, task }: TaskFormModalProps) {
  const { addTask, updateTask } = useTasksContext()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setDueDate(task.dueDate || '')
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
    }
  }, [task, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    if (task) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      })
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      })
    }

    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-4 z-50"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  {task ? 'Editar Tarea' : 'Nueva Tarea'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Titulo *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Que necesitas hacer?"
                    className="bg-secondary border-border"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripcion</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Agrega mas detalles (opcional)"
                    className="bg-secondary border-border min-h-[100px] resize-none"
                  />
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <div className="flex gap-2">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPriority(option.value)}
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all",
                          priority === option.value
                            ? option.color
                            : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Fecha limite</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={!title.trim()}>
                    {task ? 'Guardar Cambios' : 'Crear Tarea'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
