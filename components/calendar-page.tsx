'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns'
import { es } from 'date-fns/locale'
import { useTasksContext } from '@/context/tasks-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
}

export function CalendarPage() {
  const { tasks, toggleComplete } = useTasksContext()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { locale: es })
  const calendarEnd = endOfWeek(monthEnd, { locale: es })
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      return isSameDay(new Date(task.dueDate), date)
    })
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  const weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calendario</h1>
        <p className="text-muted-foreground mt-1">Visualiza tus tareas por fecha</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-semibold capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(new Date())}
              >
                <CalendarIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const dayTasks = getTasksForDate(day)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isTodayDate = isToday(day)

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative aspect-square p-1 rounded-lg transition-all flex flex-col items-center justify-start",
                      isCurrentMonth ? "hover:bg-secondary" : "opacity-30",
                      isSelected && "bg-primary/20 ring-1 ring-primary",
                      isTodayDate && !isSelected && "bg-secondary"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium",
                      isTodayDate && "text-primary",
                      !isCurrentMonth && "text-muted-foreground"
                    )}>
                      {format(day, 'd')}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {dayTasks.slice(0, 3).map((task, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              task.completed ? "bg-muted-foreground" : priorityColors[task.priority]
                            )}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <span className="text-[10px] text-muted-foreground ml-0.5">
                            +{dayTasks.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Tasks */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              {selectedDate 
                ? format(selectedDate, "d 'de' MMMM", { locale: es })
                : 'Selecciona un dia'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">
                  Haz clic en un dia para ver sus tareas
                </p>
              </div>
            ) : selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">
                  No hay tareas para este dia
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDateTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      task.completed ? "bg-secondary/30" : "bg-secondary"
                    )}
                  >
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        task.completed
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30 hover:border-primary"
                      )}
                    >
                      {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium text-sm truncate",
                        task.completed && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </p>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      task.completed ? "bg-muted-foreground" : priorityColors[task.priority]
                    )} />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
