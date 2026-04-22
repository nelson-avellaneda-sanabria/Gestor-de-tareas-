'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { FilterType, SortType, Priority } from '@/types/task'

interface TaskFiltersProps {
  filter: FilterType
  setFilter: (filter: FilterType) => void
  sort: SortType
  setSort: (sort: SortType) => void
  search: string
  setSearch: (search: string) => void
  priorityFilter: Priority | 'all'
  setPriorityFilter: (priority: Priority | 'all') => void
}

export function TaskFilters({
  filter,
  setFilter,
  sort,
  setSort,
  search,
  setSearch,
  priorityFilter,
  setPriorityFilter,
}: TaskFiltersProps) {
  const filterButtons: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'completed', label: 'Completadas' },
  ]

  return (
    <div className="space-y-4 mb-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tareas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Filter tabs and sort */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Filter tabs */}
        <div className="flex bg-muted p-1 rounded-lg">
          {filterButtons.map(btn => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                filter === btn.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Sort and Priority filter */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ordenar por</label>
                  <Select value={sort} onValueChange={(v: SortType) => setSort(v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Fecha de creación</SelectItem>
                      <SelectItem value="priority">Prioridad</SelectItem>
                      <SelectItem value="dueDate">Fecha límite</SelectItem>
                      <SelectItem value="title">Título</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prioridad</label>
                  <Select
                    value={priorityFilter}
                    onValueChange={(v: Priority | 'all') => setPriorityFilter(v)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
