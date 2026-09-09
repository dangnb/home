'use client';

import { useState } from 'react';
import { Bell, Award, BookOpen, MessageSquare, Check, Sparkles } from 'lucide-react';
import styles from './NotificationCenter.module.css';

interface NotificationItem {
  id: string;
  type: 'xp' | 'course' | 'feed';
  title: string;
  time: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'xp',
    title: '🎉 Bạn nhận được +50 XP sau khi giải đúng bài tập Reverse String!',
    time: '5 phút trước',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'feed',
    title: '❤️ Sơn Đặng đã thích bài viết của bạn trên Bản tin cộng đồng',
    time: '30 phút trước',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'course',
    title: '📚 Khóa học "React.js Từ Zero Đến Hero" vừa cập nhật bài học mới',
    time: '2 giờ trước',
    read: false,
  },
  {
    id: 'notif-4',
    type: 'xp',
    title: '🏆 Bạn đã mở khóa huy hiệu "Quiz Champion" (+100 XP)',
    time: '1 ngày trước',
    read: true,
  },
];

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = items.filter((i) => !i.read).length;

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const handleItemClick = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'xp':
        return <Award size={18} />;
      case 'course':
        return <BookOpen size={18} />;
      case 'feed':
        return <MessageSquare size={18} />;
      default:
        return <Sparkles size={18} />;
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.bellBtn}
        onClick={() => setOpen(!open)}
        title="Thông báo"
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className={styles.unreadBadge}>{unreadCount}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <div className={styles.title}>
              <Bell size={16} style={{ color: '#c084fc' }} />
              Thông Báo ({unreadCount} mới)
            </div>
            {unreadCount > 0 && (
              <button className={styles.markReadBtn} onClick={handleMarkAllRead}>
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className={styles.list}>
            {items.map((item) => (
              <div
                key={item.id}
                className={`${styles.item} ${!item.read ? styles.unreadItem : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className={styles.iconBox}>{getIcon(item.type)}</div>
                <div className={styles.content}>
                  <div className={styles.itemText}>{item.title}</div>
                  <div className={styles.itemTime}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
