export default function AdminLoading() {
    return (
        <div className="admin-container-large" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", border: "5px solid #e2e8f0", borderTop: "5px solid #3b82f6", animation: "spin 1s linear infinite", marginBottom: "15px" }}></div>
            <p style={{ color: "#64748b", fontWeight: "bold", fontSize: "1.2rem", animation: "pulse 1.5s ease-in-out infinite" }}>
                Đang đồng bộ dữ liệu...
            </p>

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
}
