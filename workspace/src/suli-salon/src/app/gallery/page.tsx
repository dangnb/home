import styles from "./Gallery.module.css";

export const metadata = {
  title: "Gallery | Suli Salon",
  description: "View our luxury nail and beauty gallery.",
};

const images = [
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152865/duthuyensonghan/edv09upalfsx87hfxf55.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152875/duthuyensonghan/yfyodulioxuhyus9hwbs.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152857/duthuyensonghan/oowp2ebixow5w4cnh1e6.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152865/duthuyensonghan/edv09upalfsx87hfxf55.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152875/duthuyensonghan/yfyodulioxuhyus9hwbs.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152857/duthuyensonghan/oowp2ebixow5w4cnh1e6.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152865/duthuyensonghan/edv09upalfsx87hfxf55.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152875/duthuyensonghan/yfyodulioxuhyus9hwbs.jpg",
  "https://res.cloudinary.com/jawkxked/image/upload/v1783152857/duthuyensonghan/oowp2ebixow5w4cnh1e6.jpg",
];

export default function GalleryPage() {
  return (
    <main style={{ paddingTop: "120px", paddingBottom: "80px", backgroundColor: "var(--bg-color)", minHeight: "100vh" }}>
      <div className="container">
        <h1 style={{ fontSize: "3rem", marginBottom: "3rem", textAlign: "center", color: "var(--text-dark)" }}>
          Our Gallery
        </h1>
        
        <div className={styles.masonryGrid}>
          {images.map((img, i) => (
            <div key={i} className={styles.masonryItem}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Gallery ${i}`} className={styles.image} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
