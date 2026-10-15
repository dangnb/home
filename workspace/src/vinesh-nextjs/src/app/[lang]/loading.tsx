export default function Loading() {
  return (
    <div className="page-skeleton-wrapper" aria-hidden="true">
      {/* Hero Banner Skeleton */}
      <div className="skeleton-hero">
        <div className="skeleton-breadcrumb"></div>
        <div className="skeleton-title"></div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container" style={{ padding: "70px 20px" }}>
        <div className="skeleton-section-header">
          <div className="skeleton-pill"></div>
          <div className="skeleton-heading"></div>
        </div>

        <div className="skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img"></div>
              <div className="skeleton-card-body">
                <div className="skeleton-line" style={{ width: "70%", height: "20px" }}></div>
                <div className="skeleton-line" style={{ width: "90%" }}></div>
                <div className="skeleton-line" style={{ width: "60%" }}></div>
                <div className="skeleton-line" style={{ width: "40%", marginTop: "12px", height: "14px" }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .page-skeleton-wrapper {
          width: 100%;
          min-height: 80vh;
          background: #ffffff;
        }

        .skeleton-hero {
          padding-top: 170px;
          padding-bottom: 85px;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .skeleton-breadcrumb {
          width: 160px;
          height: 28px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.08);
          animation: skeletonShimmerDark 1.6s infinite ease-in-out;
        }

        .skeleton-title {
          width: 280px;
          max-width: 80%;
          height: 42px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.12);
          animation: skeletonShimmerDark 1.6s infinite ease-in-out;
        }

        .skeleton-section-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 48px;
        }

        .skeleton-pill {
          width: 120px;
          height: 26px;
          border-radius: 9999px;
          background: #f1f5f9;
          animation: skeletonShimmerLight 1.6s infinite ease-in-out;
        }

        .skeleton-heading {
          width: 240px;
          height: 32px;
          border-radius: 8px;
          background: #e2e8f0;
          animation: skeletonShimmerLight 1.6s infinite ease-in-out;
        }

        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .skeleton-card {
          border-radius: 18px;
          border: 1px solid #f1f5f9;
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }

        .skeleton-img {
          width: 100%;
          height: 200px;
          background: #f1f5f9;
          animation: skeletonShimmerLight 1.6s infinite ease-in-out;
        }

        .skeleton-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skeleton-line {
          height: 14px;
          border-radius: 6px;
          background: #f1f5f9;
          animation: skeletonShimmerLight 1.6s infinite ease-in-out;
        }

        @keyframes skeletonShimmerLight {
          0% { background-color: #f1f5f9; }
          50% { background-color: #e2e8f0; }
          100% { background-color: #f1f5f9; }
        }

        @keyframes skeletonShimmerDark {
          0% { background-color: rgba(255, 255, 255, 0.06); }
          50% { background-color: rgba(255, 255, 255, 0.14); }
          100% { background-color: rgba(255, 255, 255, 0.06); }
        }
      `}</style>
    </div>
  );
}
