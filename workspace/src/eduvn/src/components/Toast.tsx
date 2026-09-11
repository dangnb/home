'use client';

import { CheckCircle2 } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className={styles.toast}>
      <CheckCircle2 size={18} style={{ color: '#4ade80' }} />
      <span>{message}</span>
    </div>
  );
}
