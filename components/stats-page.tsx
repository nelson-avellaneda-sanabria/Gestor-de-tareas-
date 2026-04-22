'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar
} from 'lucide-react'
import { useTasksContext } from '@/context/tasks-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format, subDays, isAfter, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function StatsPage() {
  const { tasks, stats } = useTasksContext()

  // Calculate additional stats
  const completedThisWeek = tasks.filter(t => {
    if (!t.completed) return false
    const weekAgo = subDays(new Date(), 7)
    return isAfter(new Date(t.createdAt), weekAgo)
  }).length

  const priorityStats = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  }

  const completedByPriority = {
    high: tasks.filter(t => t.priority === 'high' && t.completed).length,
    medium: tasks.filter(t => t.priority === 'medium' && t.completed).length,
    low: tasks.filter(t => t.priority === 'low' && t.completed).length,
  }

  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false
    return new Date(t.dueDate) < startOfDay(new Date())
  }).length

  // Last 7 days activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const created = tasks.filter(t => 
      format(new Date(t.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).length
    return {
      date,
      created,
      label: format(date, 'EEE', { locale: es })
    }
  })

  const maxCreated = Math.max(...last7Days.map(d => d.created), 1)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-foreground">Estadisticas</h1>
        <p className="text-muted-foreground mt-1">Analiza tu productividad y progreso</p>
      </motion.div>

      {/* Overview Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{overdueTasks}</p>
                <p className="text-xs text-muted-foreground">Vencidas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-info/10">
                <TrendingUp className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedThisWeek}</p>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <motion.div variants={item}>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Progreso General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="stroke-secondary"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="stroke-primary"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 440" }}
                      animate={{ strokeDasharray: `${(stats.progress / 100) * 440} 440` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">{stats.progress}%</span>
                    <span className="text-sm text-muted-foreground">Completado</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <p className="text-2xl font-bold text-primary">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completadas</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary">
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div variants={item}>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Por Prioridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* High Priority */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">Alta</span>
                  <span className="text-muted-foreground">
                    {completedByPriority.high}/{priorityStats.high}
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: priorityStats.high > 0 
                        ? `${(completedByPriority.high / priorityStats.high) * 100}%` 
                        : '0%' 
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Medium Priority */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">Media</span>
                  <span className="text-muted-foreground">
                    {completedByPriority.medium}/{priorityStats.medium}
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: priorityStats.medium > 0 
                        ? `${(completedByPriority.medium / priorityStats.medium) * 100}%` 
                        : '0%' 
                    }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </div>
              </div>

              {/* Low Priority */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">Baja</span>
                  <span className="text-muted-foreground">
                    {completedByPriority.low}/{priorityStats.low}
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: priorityStats.low > 0 
                        ? `${(completedByPriority.low / priorityStats.low) * 100}%` 
                        : '0%' 
                    }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Alta ({priorityStats.high})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm text-muted-foreground">Media ({priorityStats.medium})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-muted-foreground">Baja ({priorityStats.low})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Activity */}
      <motion.div variants={item}>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Actividad de los Ultimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40">
              {last7Days.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className="w-full bg-primary/80 rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.created / maxCreated) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    style={{ minHeight: day.created > 0 ? '8px' : '0px' }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">{day.label}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Tareas creadas por dia
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
