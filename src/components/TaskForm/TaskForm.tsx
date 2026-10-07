import { useState, type FormEvent } from 'react';
import styles from './TaskForm.module.css';

interface Props {
  onAdd: (text: string) => void;
}

export function TaskForm({ onAdd }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = text.trim();

    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs to be done?"
        aria-label="New task"
      />
      <button className={styles.button} type="submit">
        Add
      </button>
    </form>
  );
}
