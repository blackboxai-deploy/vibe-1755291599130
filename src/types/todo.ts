export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
  completionPercentage: number;
}

export interface TodoFormData {
  text: string;
}

export interface TodoActions {
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, text: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
}

export interface UseTodosReturn extends TodoActions {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  stats: TodoStats;
}