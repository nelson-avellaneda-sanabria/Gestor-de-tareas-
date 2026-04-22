'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trash2, 
  Download, 
  Upload,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react'
import { useTasksContext } from '@/context/tasks-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DeleteModal } from './delete-modal'

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

export function SettingsPage() {
  const { tasks, stats } = useTasksContext()
  const [showClearModal, setShowClearModal] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)

  const handleExport = () => {
    const data = JSON.stringify(tasks, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tareas-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 3000)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (Array.isArray(imported)) {
          localStorage.setItem('task-manager-tasks', JSON.stringify(imported))
          window.location.reload()
        }
      } catch {
        alert('Error al importar el archivo. Asegurate de que sea un JSON valido.')
      }
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    localStorage.removeItem('task-manager-tasks')
    window.location.reload()
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-2xl"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-foreground">Ajustes</h1>
        <p className="text-muted-foreground mt-1">Configura tu gestor de tareas</p>
      </motion.div>

      {/* Data Info */}
      <motion.div variants={item}>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Informacion de Datos
            </CardTitle>
            <CardDescription>
              Resumen de tus datos almacenados localmente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-secondary text-center">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary text-center">
                <p className="text-2xl font-bold text-primary">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completadas</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary text-center">
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary text-center">
                <p className="text-2xl font-bold text-foreground">{stats.progress}%</p>
                <p className="text-sm text-muted-foreground">Progreso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export */}
      <motion.div variants={item}>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Exportar Datos
            </CardTitle>
            <CardDescription>
              Descarga todas tus tareas en formato JSON
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button onClick={handleExport} className="gap-2">
                <Download className="w-4 h-4" />
                Exportar Tareas
              </Button>
              {exportSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1 text-sm text-primary"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Exportado correctamente
                </motion.span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Import */}
      <motion.div variants={item}>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Importar Datos
            </CardTitle>
            <CardDescription>
              Carga tareas desde un archivo JSON previamente exportado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-foreground font-medium text-sm">
                  <Upload className="w-4 h-4" />
                  Seleccionar Archivo
                </div>
              </label>
              {importSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1 text-sm text-primary"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Importado correctamente
                </motion.span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Nota: Importar datos reemplazara todas tus tareas actuales
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={item}>
        <Card className="bg-card border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Zona de Peligro
            </CardTitle>
            <CardDescription>
              Acciones irreversibles. Procede con cuidado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={() => setShowClearModal(true)}
              className="gap-2"
              disabled={stats.total === 0}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Todas las Tareas
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Esta accion eliminara permanentemente todas tus tareas y no se puede deshacer.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Storage Info */}
      <motion.div variants={item}>
        <Card className="bg-secondary/50 border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              Todos tus datos se almacenan localmente en tu navegador usando localStorage.
              No se envian datos a ningun servidor externo.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Clear All Modal */}
      <DeleteModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAll}
        taskTitle="todas las tareas"
      />
    </motion.div>
  )
}
