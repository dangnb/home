import styles from "./AdminLoading.module.css";

type AdminLoadingVariant = "page" | "table" | "cards" | "grid" | "form";

interface AdminLoadingProps {
  variant?: AdminLoadingVariant;
  label?: string;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`${styles.skeleton} ${className}`} />;
}

export default function AdminLoading({
  variant = "page",
  label = "Đang tải dữ liệu...",
}: AdminLoadingProps) {
  const normalizedVariant = variant === "grid" ? "cards" : variant;

  const content = {
    page: (
      <div className={styles.pageSkeleton} aria-hidden="true">
        <div className={styles.headingGroup}>
          <Skeleton className={styles.heading} />
          <Skeleton className={styles.subheading} />
        </div>
        <div className={styles.statGrid}>
          {[0, 1, 2].map((item) => <Skeleton key={item} className={styles.statCard} />)}
        </div>
        <Skeleton className={styles.surface} />
      </div>
    ),
    table: (
      <div className={styles.tableSkeleton} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className={styles.tableRow}>
            <Skeleton className={styles.cellShort} />
            <Skeleton className={styles.cellWide} />
            <Skeleton className={styles.cellMedium} />
            <Skeleton className={styles.cellShort} />
          </div>
        ))}
      </div>
    ),
    cards: (
      <div className={styles.cardSkeleton} aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className={styles.card} />)}
      </div>
    ),
    grid: (
      <div className={styles.cardSkeleton} aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className={styles.card} />)}
      </div>
    ),
    form: (
      <div className={styles.formSkeleton} aria-hidden="true">
        <Skeleton className={styles.formTitle} />
        <div className={styles.fieldGrid}>
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className={styles.field}>
              <Skeleton className={styles.fieldLabel} />
              <Skeleton className={styles.fieldControl} />
            </div>
          ))}
        </div>
        <Skeleton className={styles.formSurface} />
      </div>
    ),
  }[variant];

  return (
    <section className={`${styles.loading} ${styles[normalizedVariant] || ""}`} role="status" aria-live="polite" aria-label={label}>
      <div className={styles.loadingMessage}>
        <span className={styles.spinner} aria-hidden="true" />
        <span>{label}</span>
      </div>
      {content}
    </section>
  );
}
