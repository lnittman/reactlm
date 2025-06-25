'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Sample components for the sandboxed React app
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function TodoItem({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
      />
      <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
        {task.text}
      </span>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </motion.div>
  )
}

function Header({ taskCount }: { taskCount: number }) {
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <p className="text-blue-100 text-sm mt-1">{date}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{taskCount}</div>
          <div className="text-blue-100 text-sm">Active Tasks</div>
        </div>
      </div>
    </header>
  )
}

function AddTaskForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim())
      setText('')
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Add Task
      </button>
    </form>
  )
}

function FilterBar({ filter, onFilterChange }: { filter: string; onFilterChange: (filter: string) => void }) {
  const filters = ['all', 'active', 'completed']
  
  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            filter === f
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  )
}

export function SandboxedApp() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review React LLM documentation', completed: false },
    { id: 2, text: 'Test component selection feature', completed: false },
    { id: 3, text: 'Try the AI chat assistant', completed: false },
  ])
  const [filter, setFilter] = useState('all')
  
  const addTask = (text: string) => {
    setTasks([...tasks, { id: Date.now(), text, completed: false }])
  }
  
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }
  
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })
  
  const activeTaskCount = tasks.filter(task => !task.completed).length
  
  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Header taskCount={activeTaskCount} />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <AddTaskForm onAdd={addTask} />
          
          <div className="flex justify-between items-center">
            <FilterBar filter={filter} onFilterChange={setFilter} />
            <span className="text-sm text-gray-500">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          
          <div className="space-y-2">
            <AnimatePresence>
              {filteredTasks.map(task => (
                <TodoItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {filter === 'completed' ? 'No completed tasks' : 
               filter === 'active' ? 'No active tasks' : 
               'No tasks yet. Add one above!'}
            </div>
          )}
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>This is a sandboxed React app for testing React LLM features.</p>
          <p>Try selecting components and chatting with the AI assistant!</p>
        </div>
      </div>
    </div>
  )
}