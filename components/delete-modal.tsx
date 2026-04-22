'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  taskTitle: string
}

export function DeleteModal({ isOpen, onClose, onConfirm, taskTitle }: DeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4 z-50"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Eliminar tarea
                </h3>
                <p className="text-muted-foreground mb-6">
                  Estas seguro de que quieres eliminar{' '}
                  <span className="font-medium text-foreground">&quot;{taskTitle}&quot;</span>?
                  Esta accion no se puede deshacer.
                </p>
                <div className="flex gap-3 w-full">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={onConfirm} className="flex-1">
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
