'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import { getFeaturedCourses, testimonials, type Course, type Testimonial } from '@/lib/data';
import CourseCard from '@/components/CourseCard';
import {
  BookOpen,
  Users,
  Award,
  PlayCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  Zap,
  Code2,
} from 'lucide-react';
import styles from './page.module.css';

// ===== Counter Animation Hook =====
function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>('vi');
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setLocale(getStoredLocale());
    setFeaturedCourses(getFeaturedCourses());
  }, []);

  // Stats counters
  const coursesCount = useCountUp(50);
  const studentsCount = useCountUp(12000);
  const instructorsCount = useCountUp(15);
  const hoursCount = useCountUp(500);

  const nextTestimonial = () =>
    setActiveTestimonial((p) => (p + 1) % testimonials.length);
  const prevTestimonial = () =>
    setActiveTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero}>
        {/* Decorative orbs */}
        <div className={`glow-orb glow-orb-purple ${styles.heroOrb1}`} />
        <div className={`glow-orb glow-orb-cyan ${styles.heroOrb2}`} />
        <div className={`glow-orb glow-orb-pink ${styles.heroOrb3}`} />

        {/* Grid pattern */}
        <div className={styles.gridPattern} />

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            {/* Free badge */}
            <div className={styles.heroBadge}>
              <Sparkles size={14} />
              <span>{t('hero.freeBadge', locale)}</span>
            </div>

            <h1 className={`heading-xl ${styles.heroTitle}`}>
              {t('hero.title', locale)}{' '}
              <span className="text-gradient">{t('hero.titleHighlight', locale)}</span>
            </h1>

            <p className={styles.heroSubtitle}>{t('hero.subtitle', locale)}</p>

            <div className={styles.heroCtas}>
              <Link href="/courses" className="btn btn-primary btn-lg">
                <Zap size={18} />
                {t('hero.cta', locale)}
              </Link>
              <Link href="/courses" className="btn btn-secondary btn-lg">
                <PlayCircle size={18} />
                {t('hero.ctaSecondary', locale)}
              </Link>
            </div>

            {/* Tech icons */}
            <div className={styles.techStack}>
              <span className={styles.techItem}>⚛️ React</span>
              <span className={styles.techItem}>🟢 Node.js</span>
              <span className={styles.techItem}>🐍 Python</span>
              <span className={styles.techItem}>💙 Flutter</span>
              <span className={styles.techItem}>🐳 Docker</span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.codeWindow}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <span style={{ background: '#ef4444' }} />
                  <span style={{ background: '#f59e0b' }} />
                  <span style={{ background: '#10b981' }} />
                </div>
                <span className={styles.codeTitle}>App.tsx</span>
              </div>
              <div className={styles.codeBody}>
                <code>
                  <span className={styles.codeKeyword}>import</span> React{' '}
                  <span className={styles.codeKeyword}>from</span>{' '}
                  <span className={styles.codeString}>&apos;react&apos;</span>;{'\n'}
                  {'\n'}
                  <span className={styles.codeKeyword}>function</span>{' '}
                  <span className={styles.codeFn}>App</span>() {'{'}{'\n'}
                  {'  '}
                  <span className={styles.codeKeyword}>return</span> ({'\n'}
                  {'    '}&lt;<span className={styles.codeTag}>div</span>&gt;{'\n'}
                  {'      '}&lt;<span className={styles.codeTag}>h1</span>&gt;{'\n'}
                  {'        '}
                  <span className={styles.codeString}>Hello EduVN! 🚀</span>
                  {'\n'}
                  {'      '}&lt;/<span className={styles.codeTag}>h1</span>&gt;{'\n'}
                  {'    '}&lt;/<span className={styles.codeTag}>div</span>&gt;{'\n'}
                  {'  '});{'\n'}
                  {'}'}{'\n'}
                </code>
              </div>
            </div>

            {/* Floating cards */}
            <div className={`${styles.floatingCard} ${styles.float1}`}>
              <Code2 size={20} />
              <div>
                <strong>React.js</strong>
                <span>Frontend</span>
              </div>
            </div>
            <div className={`${styles.floatingCard} ${styles.float2}`}>
              <Award size={20} />
              <div>
                <strong>{locale === 'vi' ? 'Chứng chỉ' : 'Certificate'}</strong>
                <span>{locale === 'vi' ? 'Miễn phí' : 'Free'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statItem} ref={coursesCount.ref}>
              <BookOpen size={28} className={styles.statIcon} />
              <span className={styles.statNumber}>{coursesCount.count}+</span>
              <span className={styles.statLabel}>{t('stats.courses', locale)}</span>
            </div>
            <div className={styles.statItem} ref={studentsCount.ref}>
              <Users size={28} className={styles.statIcon} />
              <span className={styles.statNumber}>
                {studentsCount.count.toLocaleString()}+
              </span>
              <span className={styles.statLabel}>{t('stats.students', locale)}</span>
            </div>
            <div className={styles.statItem} ref={instructorsCount.ref}>
              <Award size={28} className={styles.statIcon} />
              <span className={styles.statNumber}>{instructorsCount.count}+</span>
              <span className={styles.statLabel}>{t('stats.instructors', locale)}</span>
            </div>
            <div className={styles.statItem} ref={hoursCount.ref}>
              <PlayCircle size={28} className={styles.statIcon} />
              <span className={styles.statNumber}>{hoursCount.count}+</span>
              <span className={styles.statLabel}>{t('stats.hours', locale)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED COURSES ===== */}
      <section className={`section ${styles.featured}`}>
        <div className="container">
          <div className="section-header">
            <h2 className="heading-lg">
              {t('featured.title', locale).split(' ')[0]}{' '}
              <span className="text-gradient">
                {t('featured.title', locale).split(' ').slice(1).join(' ')}
              </span>
            </h2>
            <p>{t('featured.subtitle', locale)}</p>
          </div>

          <div className={styles.courseGrid}>
            {featuredCourses.map((course, i) => (
              <div
                key={course.id}
                className={styles.courseGridItem}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          <div className={styles.viewAll}>
            <Link href="/courses" className="btn btn-secondary">
              {t('featured.viewAll', locale)}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={`section ${styles.testimonials}`}>
        <div className="container">
          <div className="section-header">
            <h2 className="heading-lg">
              {t('testimonials.title', locale).split(' ')[0]}{' '}
              <span className="text-gradient">
                {t('testimonials.title', locale).split(' ').slice(1).join(' ')}
              </span>
            </h2>
            <p>{t('testimonials.subtitle', locale)}</p>
          </div>

          <div className={styles.testimonialCarousel}>
            <button
              className={styles.carouselBtn}
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                {Array.from({ length: testimonials[activeTestimonial]?.rating || 5 }).map(
                  (_, i) => (
                    <Star key={i} size={16} fill="var(--accent-tertiary)" color="var(--accent-tertiary)" />
                  )
                )}
              </div>
              <p className={styles.testimonialText}>
                &ldquo;
                {locale === 'vi'
                  ? testimonials[activeTestimonial]?.content
                  : testimonials[activeTestimonial]?.contentEn}
                &rdquo;
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  {testimonials[activeTestimonial]?.name.charAt(0)}
                </div>
                <div>
                  <strong>{testimonials[activeTestimonial]?.name}</strong>
                  <span>
                    {locale === 'vi'
                      ? testimonials[activeTestimonial]?.role
                      : testimonials[activeTestimonial]?.roleEn}
                  </span>
                </div>
              </div>
            </div>

            <button
              className={styles.carouselBtn}
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dots */}
          <div className={styles.carouselDots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === activeTestimonial ? styles.dotActive : ''}`}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className={styles.cta}>
        <div className={`glow-orb glow-orb-purple ${styles.ctaOrb1}`} />
        <div className={`glow-orb glow-orb-cyan ${styles.ctaOrb2}`} />

        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className="heading-lg">{t('cta.title', locale)}</h2>
            <p>{t('cta.subtitle', locale)}</p>
            <Link href="/register" className="btn btn-primary btn-lg">
              <Sparkles size={18} />
              {t('cta.button', locale)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
