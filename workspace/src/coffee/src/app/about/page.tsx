import Link from "next/link";

const values = [
  "Hạt cà phê chọn lọc và rang vừa để giữ vị mộc.",
  "Không gian mở, nhiều ánh sáng, phù hợp làm việc và gặp gỡ.",
  "Menu cập nhật theo mùa, luôn có món mới để thử.",
  "Đội ngũ trẻ, thân thiện và thích kể chuyện bằng đồ uống.",
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <section className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="animate-fade-up">
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Về chúng mình</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.04em] text-[#2b160c] sm:text-7xl">
            Mộc Coffee bắt đầu từ một ly cà phê thật lòng.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#75543d]">
            Chúng mình tạo ra một nơi vừa ấm áp như quán quen, vừa hiện đại như studio sáng tạo. Mỗi góc ngồi, mỗi playlist và mỗi công thức đều được chọn để ngày của bạn nhẹ hơn.
          </p>
        </div>
        <div className="relative min-h-[420px] rounded-[3rem] bg-gradient-to-br from-[#f5c17f] via-[#f7eadb] to-[#8cac68] p-8 shadow-2xl shadow-[#8a4f25]/20">
          <div className="animate-float absolute right-8 top-8 rounded-[2rem] bg-white/75 p-5 shadow-xl backdrop-blur">
            <p className="text-3xl font-black text-[#2b160c]">2026</p>
            <p className="font-semibold text-[#75543d]">Mở cửa mỗi ngày</p>
          </div>
          <div className="absolute bottom-8 left-8 max-w-sm rounded-[2rem] bg-[#2b160c] p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f7c873]">Our vibe</p>
            <p className="mt-3 text-2xl font-black">Warm, fresh, creative.</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mb-8 max-w-2xl">
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Giá trị</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2b160c]">Điều làm nên chất Mộc.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {values.map((value, index) => (
            <div key={value} className="animate-fade-up rounded-[2rem] border border-white/70 bg-white/70 p-7 shadow-sm backdrop-blur" style={{ animationDelay: `${index * 90}ms` }}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f3ddc2] text-xl font-black text-[#8a4f25]">0{index + 1}</span>
              <p className="mt-5 text-lg font-bold leading-8 text-[#2b160c]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] bg-[#2b160c] p-8 text-white sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="font-bold uppercase tracking-[0.24em] text-[#f7c873]">Hành trình</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">Từ quầy pha chế nhỏ đến cộng đồng yêu cà phê.</h2>
            <p className="mt-5 leading-8 text-[#e6cfb7]">
              Mộc Coffee muốn trở thành điểm hẹn nơi bạn có thể làm việc hiệu quả, gặp người thương, thử món mới và để lại vài dòng review thật vui cho món mình thích.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/products" className="rounded-full bg-white px-6 py-4 text-center font-black text-[#2b160c] transition hover:-translate-y-1">
              Xem menu hôm nay
            </Link>
            <Link href="/recruitment" className="rounded-full border border-white/25 px-6 py-4 text-center font-black text-white transition hover:-translate-y-1 hover:bg-white/10">
              Tham gia cùng chúng mình
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
