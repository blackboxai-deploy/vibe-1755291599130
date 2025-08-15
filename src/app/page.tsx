'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Trash2, Edit2, Check, X, Plus } from 'lucide-react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

type FilterType = 'all' | 'active' | 'completed'

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }))
        setTodos(parsedTodos)
      } catch (error) {
        console.error('Error loading todos:', error)
      }
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setTodos([todo, ...todos])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId
          ? { ...todo, text: editText.trim(), updatedAt: new Date() }
          : todo
      ))
    }
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed
      case 'completed':
        return todo.completed
      default:
        return true
    }
  })

  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const activeTodos = totalTodos - completedTodos
  const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-red-200">
          <CardHeader className="text-center border-b border-red-100">
            <CardTitle className="text-3xl font-bold text-red-800">
              Todo List
            </CardTitle>
            <div className="space-y-2">
              <div className="flex justify-center gap-4 text-sm text-red-600">
                <span>Total: {totalTodos}</span>
                <span>Active: {activeTodos}</span>
                <span>Completed: {completedTodos}</span>
              </div>
              {totalTodos > 0 && (
                <div className="space-y-1">
                  <Progress value={progressPercentage} className="h-2 bg-red-100 [&>div]:bg-red-500" />
                  <p className="text-xs text-red-500">
                    {Math.round(progressPercentage)}% completed
                  </p>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Add Todo Form */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a new todo..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-red-200 focus:border-red-400 focus:ring-red-400"
              />
              <Button onClick={addTodo} disabled={!newTodo.trim()} className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  All {totalTodos > 0 && <Badge variant="secondary" className="ml-1">{totalTodos}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active {activeTodos > 0 && <Badge variant="secondary" className="ml-1">{activeTodos}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed {completedTodos > 0 && <Badge variant="secondary" className="ml-1">{completedTodos}</Badge>}
                </TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="mt-4">
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {filter === 'all' && 'No todos yet. Add one above!'}
                    {filter === 'active' && 'No active todos. Great job!'}
                    {filter === 'completed' && 'No completed todos yet.'}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          todo.completed
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                        />
                        
                        {editingId === todo.id ? (
                          <div className="flex-1 flex gap-2">
                            <Input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={handleEditKeyPress}
                              className="flex-1"
                              autoFocus
                            />
                            <Button size="sm" onClick={saveEdit}>
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span
                              className={`flex-1 cursor-pointer ${
                                todo.completed
                                  ? 'line-through text-gray-500'
                                  : 'text-gray-800'
                              }`}
                              onDoubleClick={() => startEditing(todo.id, todo.text)}
                            >
                              {todo.text}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditing(todo.id, todo.text)}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteTodo(todo.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Bulk Actions */}
            {completedTodos > 0 && (
              <>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {completedTodos} completed task{completedTodos !== 1 ? 's' : ''}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCompleted}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear Completed
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center mt-4 text-sm text-gray-500">
          Double-click to edit • Enter to save • Escape to cancel
        </div>
      </div>
    </div>
  )
}