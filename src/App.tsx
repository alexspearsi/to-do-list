import { useMemo, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Filter, Task } from './types';
import { TaskForm } from './components/TaskForm/TaskForm';
import { TaskFilters } from './components/TaskFilters/TaskFilters';
import { TaskList } from './components/TaskList/TaskList';
import styles from './App.module.css';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-tasks', []);
  const [filter, setFilter] = useState<Filter>('all');

  const addTask = (text: string) => {
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), text, completed: false }]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  };

  const editTask = (id: string, text: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, text } : task)));
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.completed);
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'all':
        return tasks;
    }
  }, [tasks, filter]);

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>To-Do List</h1>
      <TaskForm onAdd={addTask} />
      <TaskFilters current={filter} onChange={setFilter} />
      <TaskList
        tasks={filteredTasks}
        filter={filter}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
      />
    </div>
  );
}

export default App;
