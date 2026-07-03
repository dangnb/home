import styles from "./Footer.module.css";
import type { SiteSettings } from "@/lib/db";
import { FaPhoneAlt, FaFacebookF, FaTiktok, FaYoutube, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const s = settings;

  const hotlineDisplay = s.hotline.replace(/(\d{4})(\d{3})(\d{3,4})/, "$1 $2 $3");

  return (
    <footer className={styles.footer}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <div className={styles.topContact}>
            <div className={styles.topContactItem}>
              <span className={styles.topLabel}>Hotline ({s.workingHours})</span>
              <a href={`tel:${s.hotline}`} className={styles.topValue}>
                <FaPhoneAlt style={{ marginRight: '8px' }} />
                {hotlineDisplay}
              </a>
            </div>
            {s.hotline2 && (
              <div className={styles.topContactItem}>
                <span className={styles.topLabel}>Hotline 2</span>
                <a href={`tel:${s.hotline2}`} className={styles.topValue}>
                  <FaPhoneAlt style={{ marginRight: '8px' }} />
                  {s.hotline2}
                </a>
              </div>
            )}
            <div className={styles.topContactItem}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                width: 36, height: 36, borderRadius: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <MdEmail size={20} color="white" />
              </div>
              <div>
                <span className={styles.topLabel}>Email</span>
                <a href={`mailto:${s.email}`} className={styles.topValue}>{s.email}</a>
              </div>
            </div>
          </div>
          <div className={styles.socialIcons}>
            {s.facebook && <a href={s.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook"><FaFacebookF /></a>}
            {s.tiktok && <a href={s.tiktok} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="TikTok"><FaTiktok /></a>}
            {s.youtube && <a href={s.youtube} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube"><FaYoutube /></a>}
            {s.instagram && <a href={s.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram"><FaInstagram /></a>}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className={`container ${styles.mainGrid}`}>
        {/* Col 1: Logo + taglines */}
        <div className={styles.brandCol}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logopng-1.png" alt={s.siteName} className={styles.logo} />
          <ul className={styles.bulletList}>
            {s.footerTaglines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          {s.address && (
            <p style={{ display: 'flex', gap: '0.5rem', fontSize: "0.82rem", color: "#aaa", marginTop: "0.5rem", lineHeight: 1.5 }}>
              <FaMapMarkerAlt style={{ alignSelf: 'flex-start', marginTop: '3px', flexShrink: 0 }} />
              <span>{s.address}</span>
            </p>
          )}
        </div>

        {/* Col 2: Google Map */}
        <div className={styles.widgetCol}>
          <h4 className={styles.widgetTitle}>{s.siteName} Google Map</h4>
          <div className={styles.mapEmbed}>
            <iframe
              src={s.mapEmbedUrl}
              width="100%"
              height="220"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen
              loading="lazy"
              title="Google Map"
            />
          </div>
        </div>

        {/* Col 3: TikTok */}
        {s.tiktok && (
          <div className={styles.widgetCol}>
            <h4 className={styles.widgetTitle}>{s.siteName} TikTok</h4>
            <div className={styles.tiktokEmbed}>
              <blockquote
                className="tiktok-embed"
                cite={s.tiktok}
                data-unique-id={s.tiktok.split("@")[1] ?? ""}
                data-embed-type="creator"
                style={{ maxWidth: "100%", minWidth: "100%" }}
              >
                <section>
                  <a target="_blank" href={`${s.tiktok}?refer=creator_embed`} rel="noreferrer">
                    @{s.tiktok.split("@")[1] ?? ""}
                  </a>
                </section>
              </blockquote>
            </div>
          </div>
        )}

        {/* Col 4: Facebook */}
        {s.facebook && (
          <div className={styles.widgetCol}>
            <h4 className={styles.widgetTitle}>{s.siteName} Facebook</h4>
            <div className={styles.fbEmbed}>
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(s.facebook)}&tabs&width=300&height=220&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                width="100%"
                height="220"
                style={{ border: "none", overflow: "hidden", borderRadius: "8px" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Page"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        {s.copyright}
      </div>
    </footer>
  );
}
