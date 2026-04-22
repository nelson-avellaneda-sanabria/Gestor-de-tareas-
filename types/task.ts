export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  dueDate?: string
  completed: boolean
  createdAt: string
}

export type FilterType = 'all' | 'completed' | 'pending'
export type SortType = 'date' | 'priority' | 'dueDate' | 'title'
