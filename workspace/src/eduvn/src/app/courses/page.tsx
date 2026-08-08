'use client';

import { useState, useEffect, useMemo } from 'react';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import { courses, categories, searchCourses, type Course } from '@/lib/data';
import CourseCard from '@/components/CourseCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import styles from './page.module.css';

export default function CoursesPage() {
  const [locale, setLocale] = useState<Locale>('vi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating'>('popular');

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  const filteredCourses = useMemo(() => {
    let result: Course[] = searchQuery ? searchCourses(searchQuery) : [...courses];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Price filter
    if (priceFilter === 'free') {
      result = result.filter((c) => c.isFree);
    } else if (priceFilter === 'premium') {
      result = result.filter((c) => !c.isFree);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.totalStudents - a.totalStudents);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, priceFilter, sortBy]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={`glow-orb glow-orb-purple ${styles.headerOrb}`} />
        <div className="container">
          <h1 className="heading-lg">
            {t('courses.title', locale).split(' ')[0]}{' '}
            <span className="text-gradient">
              {t('courses.title', locale).split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <p className={styles.subtitle}>{t('courses.subtitle', locale)}</p>
        </div>
      </section>

      <div className="container">
        {/* Search & Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t('courses.search', locale)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterRow}>
            {/* Categories */}
            <div className={styles.categoryTabs}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.categoryTab} ${selectedCategory === cat.id ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span>{locale === 'vi' ? cat.label : cat.labelEn}</span>
                </button>
              ))}
            </div>

            <div className={styles.filterControls}>
              {/* Price Filter */}
              <div className={styles.filterGroup}>
                <SlidersHorizontal size={16} />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'premium')}
                  className={styles.select}
                >
                  <option value="all">{t('courses.filterAll', locale)}</option>
                  <option value="free">{t('courses.filterFree', locale)}</option>
                  <option value="premium">{t('courses.filterPremium', locale)}</option>
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'rating')}
                className={styles.select}
              >
                <option value="popular">{locale === 'vi' ? 'Phổ biến' : 'Popular'}</option>
                <option value="newest">{locale === 'vi' ? 'Mới nhất' : 'Newest'}</option>
                <option value="rating">{locale === 'vi' ? 'Đánh giá cao' : 'Top Rated'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={styles.results}>
          <p className={styles.resultCount}>
            {filteredCourses.length}{' '}
            {locale === 'vi' ? 'khóa học' : 'courses'}
          </p>

          {filteredCourses.length > 0 ? (
            <div className={styles.courseGrid}>
              {filteredCourses.map((course, i) => (
                <div
                  key={course.id}
                  className={styles.gridItem}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <p>{t('courses.noResults', locale)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
