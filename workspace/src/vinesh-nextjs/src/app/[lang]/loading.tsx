export default function Loading() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", width: "100%", flexDirection: "column" }}>
            <div className="skeleton-loader" style={{ width: "40px", height: "40px", borderRadius: "50%", border: "4px solid #f3f3f3", borderTop: "4px solid #8cc63f", animation: "spin 1s linear infinite", marginBottom: "15px" }}></div>
            <p style={{ color: "#64748b", fontWeight: 500, fontSize: "1.1rem", animation: "pulse 1.5s ease-in-out infinite" }}>
                Đang tải dữ liệu...
            </p>

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
        </div>
    );
}
