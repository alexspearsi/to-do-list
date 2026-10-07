import type { Task } from '../../types';
import styles from './TaskItem.module.css';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className={styles.item}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark task: ${task.text}`}
      />
      <span className={`${styles.text} ${task.completed ? styles.completed : ''}`}>
        {task.text}
      </span>
      <button
        type="button"
        className={styles.deleteButton}
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.text}`}
      >
        ✕
      </button>
    </li>
  );
}
