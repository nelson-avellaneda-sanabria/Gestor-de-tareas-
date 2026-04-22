'use client'

import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  ListTodo,
  Calendar,
  ArrowRight
} from 'lucide-react'
import { useTasksContext } from '@/context/tasks-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
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

export function Dashboard() {
  const { tasks, stats, toggleComplete } = useTasksContext()

  const recentTasks = tasks
    .filter(t => !t.completed)
    .slice(0, 5)

  const upcomingTasks = tasks
    .filter(t => t.dueDate && !t.completed)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 4)

  const statCards = [
    { 
      label: 'Total de Tareas', 
      value: stats.total, 
      icon: ListTodo, 
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
    { 
      label: 'Completadas', 
      value: stats.completed, 
      icon: CheckCircle2, 
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    { 
      label: 'Pendientes', 
      value: stats.pending, 
      icon: Clock, 
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    { 
      label: 'Alta Prioridad', 
      value: stats.highPriority, 
      icon: AlertTriangle, 
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
  ]

  const getDueDateLabel = (dueDate: string) => {
    const date = new Date(dueDate)
    if (isPast(date) && !isToday(date)) return { label: 'Vencida', color: 'text-destructive' }
    if (isToday(date)) return { label: 'Hoy', color: 'text-warning' }
    if (isTomorrow(date)) return { label: 'Manana', color: 'text-info' }
    return { label: format(date, 'd MMM', { locale: es }), color: 'text-muted-foreground' }
  }

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground mt-1">Bienvenido de vuelta. Aqui esta tu resumen.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Progress Card */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/20">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Progreso General</h3>
                  <p className="text-muted-foreground">
                    Has completado {stats.completed} de {stats.total} tareas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 lg:w-48">
                  <div className="h-3 bg-background rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-primary">{stats.progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <motion.div variants={item}>
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Tareas Recientes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tareas" className="text-primary hover:text-primary/80">
                  Ver todas <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ListTodo className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No hay tareas pendientes</p>
                </div>
              ) : (
                recentTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 hover:border-primary transition-colors flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md border ${priorityColors[task.priority]}`}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={item}>
          <Card className="bg-card border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Proximas Fechas</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/calendario" className="text-primary hover:text-primary/80">
                  Ver calendario <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No hay fechas limite proximas</p>
                </div>
              ) : (
                upcomingTasks.map((task) => {
                  const dueInfo = getDueDateLabel(task.dueDate!)
                  return (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{task.title}</p>
                        <p className={`text-sm ${dueInfo.color}`}>{dueInfo.label}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-md border ${priorityColors[task.priority]}`}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </motion.div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
