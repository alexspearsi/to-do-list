import type { Filter, Task } from '../../types';
import { TaskItem } from '../TaskItem/TaskItem';
import styles from './TaskList.module.css';

interface Props {
  tasks: Task[];
  filter: Filter;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: 'No tasks yet',
  active: 'No active tasks',
  completed: 'No completed tasks',
};

export function TaskList({ tasks, filter, onToggle, onDelete, onEdit }: Props) {
  if (tasks.length === 0) {
    return <p className={styles.empty}>{EMPTY_MESSAGES[filter]}</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
