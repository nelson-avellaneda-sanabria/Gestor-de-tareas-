'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, ListTodo } from 'lucide-react'

interface ProgressBarProps {
  stats: {
    total: number
    completed: number
    pending: number
    progress: number
  }
}

export function ProgressBar({ stats }: ProgressBarProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">Progreso</h3>
        <span className="text-2xl font-bold text-primary">{stats.progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${stats.progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <ListTodo className="h-4 w-4" />
            <span className="text-xs">Total</span>
          </div>
          <span className="text-lg font-bold text-foreground">{stats.total}</span>
        </div>
        <div className="bg-emerald-500/10 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs">Hechas</span>
          </div>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</span>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-2">
          <div className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Pendientes</span>
          </div>
          <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.pending}</span>
        </div>
      </div>
    </div>
  )
}
