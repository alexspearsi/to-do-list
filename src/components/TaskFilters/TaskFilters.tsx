import type { Filter } from '../../types';
import styles from './TaskFilters.module.css';

interface Props {
  current: Filter;
  onChange: (filter: Filter) => void;
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function TaskFilters({ current, onChange }: Props) {
  return (
    <div className={styles.filters}>
      {FILTERS.map(({ value, label }) => {
        const isActive = current === value;
        return (
          <button
            key={value}
            type="button"
            className={`${styles.button} ${isActive ? styles.active : ''}`}
            aria-pressed={isActive}
            onClick={() => onChange(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
