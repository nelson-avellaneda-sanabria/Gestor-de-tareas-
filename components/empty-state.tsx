'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Search, CheckCircle2 } from 'lucide-react'

interface EmptyStateProps {
  type: 'no-tasks' | 'no-results' | 'all-complete'
}

export function EmptyState({ type }: EmptyStateProps) {
  const config = {
    'no-tasks': {
      icon: ClipboardList,
      title: 'No hay tareas',
      description: 'Comienza agregando tu primera tarea usando el botón de arriba.',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    'no-results': {
      icon: Search,
      title: 'Sin resultados',
      description: 'No se encontraron tareas que coincidan con tu búsqueda o filtros.',
      color: 'text-muted-foreground',
      bg: 'bg-muted',
    },
    'all-complete': {
      icon: CheckCircle2,
      title: '¡Excelente trabajo!',
      description: 'Has completado todas tus tareas. ¿Listo para agregar más?',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  }

  const { icon: Icon, title, description, color, bg } = config[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className={`h-16 w-16 rounded-full ${bg} flex items-center justify-center mb-4`}>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-muted-foreground text-center max-w-sm">{description}</p>
    </motion.div>
  )
}
