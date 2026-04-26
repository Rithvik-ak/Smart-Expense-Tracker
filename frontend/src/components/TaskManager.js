'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Trash2, ListTodo } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Finish Operating Systems Assignment', completed: false },
    { id: 2, text: 'Review Weekly Budget', completed: true },
    { id: 3, text: 'Plan Meal Prep for Finals Week', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now(), text: newTask, completed: false }, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="glass-card p-8 rounded-[32px] flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-white flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
            <ListTodo className="h-5 w-5" />
          </div>
          Mission Control
        </h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          {tasks.filter(t => t.completed).length}/{tasks.length} Completed
        </span>
      </div>

      <form onSubmit={addTask} className="relative mb-6">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Objective..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium focus:outline-none focus:border-purple-500/50 transition-colors"
        />
        <button type="submit" className="absolute right-2 top-2 p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-all">
          <Plus className="h-5 w-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                task.completed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id)} className="transition-transform active:scale-90">
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-600" />
                  )}
                </button>
                <span className={`text-sm font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {task.text}
                </span>
              </div>
              <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
