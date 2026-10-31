import React from "react";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        background: "#141b15",
        color: "#f4f2ee",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: 38,
            fontWeight: 500,
            color: "#f4f2ee",
          }}
        >
          Nếp <em style={{ color: "#e5b96f", fontWeight: 400 }}>Journeys</em>
        </div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#e5b96f",
          }}
        >
          Đang mở ấn phẩm du khảo...
        </div>
      </div>
    </div>
  );
}
