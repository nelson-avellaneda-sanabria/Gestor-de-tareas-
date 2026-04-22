'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  BarChart3, 
  Settings,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTasksContext } from '@/context/tasks-context'
import { useState } from 'react'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Panel' },
  { href: '/tareas', icon: ListTodo, label: 'Tareas' },
  { href: '/calendario', icon: Calendar, label: 'Calendario' },
  { href: '/estadisticas', icon: BarChart3, label: 'Estadisticas' },
  { href: '/ajustes', icon: Settings, label: 'Ajustes' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { stats } = useTasksContext()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border lg:hidden"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">TaskFlow</h1>
              <p className="text-xs text-muted-foreground">Gestor de Tareas</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70"
                  )} />
                  <span className="font-medium">{item.label}</span>
                  {item.href === '/tareas' && stats.pending > 0 && (
                    <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {stats.pending}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Stats Card */}
          <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Progreso</span>
              <span className="text-sm font-semibold text-primary">{stats.progress}%</span>
            </div>
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completed} de {stats.total} tareas completadas
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
