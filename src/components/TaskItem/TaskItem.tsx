import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Task } from '../../types';
import styles from './TaskItem.module.css';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const startEdit = () => {
    setEditText(task.text);
    setIsEditing(true);
  };

  const commitEdit = () => {
    const trimmed = editText.trim();

    if (trimmed) {
      onEdit(task.id, trimmed);
    }

    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      commitEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();

      cancelEdit();
    }
  };

  return (
    <li className={styles.item}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark task: ${task.text}`}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className={styles.editInput}
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          aria-label="Edit task text"
        />
      ) : (
        <span
          className={`${styles.text} ${task.completed ? styles.completed : ''}`}
          onDoubleClick={startEdit}
        >
          {task.text}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className={styles.editButton}
          onClick={startEdit}
          aria-label={`Edit task: ${task.text}`}
        >
          ✎
        </button>
      )}
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
