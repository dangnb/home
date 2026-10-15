export default function AdminLoading() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", width: "100%", flexDirection: "column", gap: "16px" }}>
      <div style={{
        width: "52px",
        height: "52px",
        borderRadius: "14px",
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "24px",
        fontWeight: "900",
        boxShadow: "0 8px 20px rgba(22, 163, 74, 0.35)",
        animation: "adminPulse 1.8s infinite ease-in-out"
      }}>
        W
      </div>
      <div style={{ width: "140px", height: "3px", background: "#e2e8f0", borderRadius: "99px", overflow: "hidden", position: "relative" }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "50%",
          background: "linear-gradient(90deg, #16a34a 0%, #4ade80 100%)",
          borderRadius: "99px",
          animation: "adminSlide 1.2s cubic-bezier(0.65, 0, 0.35, 1) infinite"
        }}></div>
      </div>
      <p style={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem", margin: 0 }}>
        Đang đồng bộ dữ liệu quản trị...
      </p>

      <style>{`
        @keyframes adminPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 20px rgba(22, 163, 74, 0.35); }
          50% { transform: scale(1.05); box-shadow: 0 12px 28px rgba(22, 163, 74, 0.5); }
        }
        @keyframes adminSlide {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
