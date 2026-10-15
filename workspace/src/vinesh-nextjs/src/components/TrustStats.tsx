interface TrustStatsProps {
  lang: string;
}

export default function TrustStats({ lang }: TrustStatsProps) {
  const isVi = lang === "vi";

  const stats = [
    {
      icon: "ph-fill ph-medal",
      value: "10+",
      label: isVi ? "Năm Kinh Nghiệm" : "Years Experience",
      sublabel: isVi ? "Chuyên môn kiểm định sâu rộng" : "Extensive inspection expertise",
    },
    {
      icon: "ph-fill ph-buildings",
      value: "500+",
      label: isVi ? "Doanh Nghiệp Tin Chọn" : "Corporate Clients",
      sublabel: isVi ? "Đồng hành trên toàn quốc" : "Nationwide partnership",
    },
    {
      icon: "ph-fill ph-certificate",
      value: "100%",
      label: isVi ? "Đạt Chuẩn Kiểm Định" : "Standard Compliance",
      sublabel: isVi ? "Quy chuẩn an toàn nghiêm ngặt" : "Strict regulatory compliance",
    },
    {
      icon: "ph-fill ph-headset",
      value: "24/7",
      label: isVi ? "Hỗ Trợ Kỹ Thuật" : "Dedicated Support",
      sublabel: isVi ? "Tư vấn & giải đáp tận tâm" : "Fast & responsive assistance",
    },
  ];

  return (
    <section className="trust-stats-section" aria-label="Trust & Credentials">
      <div className="container">
        <div className="trust-stats-grid" data-aos="fade-up" data-aos-offset="30" suppressHydrationWarning>
          {stats.map((item, idx) => (
            <div key={idx} className="trust-stat-card">
              <div className="trust-stat-icon-box">
                <i className={item.icon}></i>
              </div>
              <div className="trust-stat-info">
                <div className="trust-stat-number">{item.value}</div>
                <div className="trust-stat-label">{item.label}</div>
                <div className="trust-stat-sublabel">{item.sublabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
