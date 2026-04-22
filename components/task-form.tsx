'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Calendar, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Task, Priority } from '@/types/task'

interface TaskFormProps {
  onSubmit: (task: { title: string; description?: string; priority: Priority; dueDate?: string }) => void
  editingTask?: Task | null
  onCancelEdit?: () => void
}

export function TaskForm({ onSubmit, editingTask, onCancelEdit }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (editingTask) {
      setIsOpen(true)
      setTitle(editingTask.title)
      setDescription(editingTask.description || '')
      setPriority(editingTask.priority)
      setDueDate(editingTask.dueDate || '')
    }
  }, [editingTask])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    })

    resetForm()
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setIsOpen(false)
    onCancelEdit?.()
  }

  const priorityColors = {
    low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    high: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
  }

  return (
    <div className="mb-6">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-full gap-2 h-12 text-base bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5" />
              Nueva Tarea
            </Button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-xl p-4 space-y-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-foreground">
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={resetForm}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Título de la tarea *"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="h-11"
                autoFocus
              />

              <Textarea
                placeholder="Descripción (opcional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                className="resize-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Flag className="h-3.5 w-3.5" />
                    Prioridad
                  </label>
                  <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
                    <SelectTrigger className={`h-10 ${priorityColors[priority]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Fecha límite
                  </label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={!title.trim()}>
                {editingTask ? 'Guardar Cambios' : 'Agregar Tarea'}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
