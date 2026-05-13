import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Top Bar: Hotline + Email + Social */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <div className={styles.topContact}>
            <div className={styles.topContactItem}>
              <span className={styles.topLabel}>Hotline (24/7)</span>
              <a href="tel:0796768636" className={styles.topValue}>0796 768 636</a>
            </div>
            <div className={styles.topContactItem}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{opacity: 0.8}}>
                <rect width="36" height="36" rx="18" fill="rgba(255,255,255,0.1)"/>
                <path d="M9 12h18v12H9z" stroke="white" strokeWidth="1.5" fill="none" rx="1"/>
                <path d="M9 13l9 7 9-7" stroke="white" strokeWidth="1.5" fill="none"/>
              </svg>
              <div>
                <span className={styles.topLabel}>Email</span>
                <a href="mailto:support@duthuyensonghan.vn" className={styles.topValue}>support@duthuyensonghan.vn</a>
              </div>
            </div>
          </div>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/2datickets" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">f</a>
            <a href="https://www.tiktok.com/@duthuyensonghan.danang" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="TikTok">♪</a>
            <a href="https://www.youtube.com/@2datickets" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">▶</a>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className={`container ${styles.mainGrid}`}>
        {/* Col 1: Logo + Info */}
        <div className={styles.brandCol}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logopng-1.png" alt="2Da Tickets" className={styles.logo} />
          <ul className={styles.bulletList}>
            <li>✅ Ưu tiên view đẹp.</li>
            <li>✅ Trực tiếp đón tại bến.</li>
            <li>✅ Trực tiếp dẫn lên du thuyền.</li>
          </ul>
        </div>

        {/* Col 2: Google Map */}
        <div className={styles.widgetCol}>
          <h4 className={styles.widgetTitle}>2Da Tickets Google Map</h4>
          <div className={styles.mapEmbed}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.0!2d108.2270!3d16.0600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142195d3a6e8c0f%3A0x2d0d6e31f24c8b4!2zRHUgdGh1eeG7gW4gU8O0bmcgSMOgbg!5e0!3m2!1svi!2svn!4v1234567890"
              width="100%"
              height="220"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen
              loading="lazy"
              title="2Da Tickets Google Map"
            ></iframe>
          </div>
        </div>

        {/* Col 3: TikTok */}
        <div className={styles.widgetCol}>
          <h4 className={styles.widgetTitle}>2Da Tickets Tiktok</h4>
          <div className={styles.tiktokEmbed}>
            <blockquote
              className="tiktok-embed"
              cite="https://www.tiktok.com/@duthuyensonghan.danang"
              data-unique-id="duthuyensonghan.danang"
              data-embed-type="creator"
              style={{ maxWidth: '100%', minWidth: '100%' }}
            >
              <section>
                <a target="_blank" href="https://www.tiktok.com/@duthuyensonghan.danang?refer=creator_embed" rel="noreferrer">
                  @duthuyensonghan.danang
                </a>
              </section>
            </blockquote>
            {/* TikTok embed script */}
          </div>
        </div>

        {/* Col 4: Facebook */}
        <div className={styles.widgetCol}>
          <h4 className={styles.widgetTitle}>2Da Tickets FaceBook</h4>
          <div className={styles.fbEmbed}>
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F2datickets&tabs&width=300&height=220&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="100%"
              height="220"
              style={{ border: 'none', overflow: 'hidden', borderRadius: '8px' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title="2Da Tickets Facebook"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        © Copyright 2Da Tickets Du Thuyền Sông Hàn Đà Nẵng
      </div>
    </footer>
  );
}

