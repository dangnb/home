const jobs = [
  {
    title: "Barista full-time",
    type: "Full-time",
    desc: "Pha chế đồ uống, kiểm soát chất lượng ly và cùng team phát triển món mới.",
  },
  {
    title: "Nhân viên phục vụ",
    type: "Part-time",
    desc: "Đón khách, tư vấn menu, giữ không gian quán luôn gọn gàng và thân thiện.",
  },
  {
    title: "Ca trưởng",
    type: "Full-time",
    desc: "Điều phối ca làm, hỗ trợ đào tạo nhân sự mới và đảm bảo trải nghiệm khách hàng.",
  },
  {
    title: "Content creator",
    type: "Part-time",
    desc: "Chụp ảnh, quay short video và kể câu chuyện Mộc Coffee trên mạng xã hội.",
  },
];

const benefits = ["Đào tạo barista từ cơ bản", "Lịch làm linh hoạt", "Ưu đãi đồ uống mỗi ca", "Team trẻ, nhiều hoạt động sáng tạo"];

export default function RecruitmentPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-fade-up">
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Tuyển dụng</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.04em] text-[#2b160c] sm:text-7xl">
            Gia nhập đội ngũ Mộc Coffee.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#75543d]">
            Nếu bạn thích không gian trẻ trung, thích học về cà phê và muốn mỗi ca làm đều có năng lượng tích cực, gửi thông tin cho chúng mình nhé.
          </p>
        </div>
        <div className="animate-gradient rounded-[3rem] bg-gradient-to-br from-[#f5c17f] via-[#fff4e4] to-[#8cac68] p-8 shadow-2xl shadow-[#8a4f25]/20">
          <div className="rounded-[2.25rem] bg-white/70 p-7 backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b56b2a]">Culture</p>
            <p className="mt-4 text-3xl font-black text-[#2b160c]">Pha chế tử tế, phục vụ vui vẻ, lớn lên cùng nhau.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mb-8">
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Quyền lợi</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2b160c]">Làm việc có vibe, học nghề có lộ trình.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={benefit} className="animate-fade-up rounded-[2rem] bg-white/70 p-6 shadow-sm backdrop-blur" style={{ animationDelay: `${index * 90}ms` }}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#2b160c] font-black text-[#f7c873]">✓</span>
              <p className="mt-5 font-black leading-7 text-[#2b160c]">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="font-bold uppercase tracking-[0.24em] text-[#b56b2a]">Vị trí mở</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#2b160c]">Chọn vai trò hợp với bạn.</h2>
          <div className="mt-8 space-y-4">
            {jobs.map((job) => (
              <article key={job.title} className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-[#2b160c]">{job.title}</h3>
                    <p className="mt-3 leading-7 text-[#75543d]">{job.desc}</p>
                  </div>
                  <span className="rounded-full bg-[#f7eadb] px-4 py-2 text-sm font-black text-[#8a4f25]">{job.type}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <form className="h-fit rounded-[2.5rem] bg-[#2b160c] p-7 text-white shadow-2xl shadow-[#2b160c]/20 sm:p-8">
          <p className="font-bold uppercase tracking-[0.24em] text-[#f7c873]">Ứng tuyển nhanh</p>
          <h2 className="mt-3 text-3xl font-black">Để lại thông tin</h2>
          <div className="mt-6 grid gap-4">
            <input className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/55 focus:border-[#f7c873]" placeholder="Họ và tên" />
            <input className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/55 focus:border-[#f7c873]" placeholder="Số điện thoại" />
            <select className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-[#f7c873]" defaultValue="Barista full-time">
              {jobs.map((job) => (
                <option key={job.title} className="text-[#2b160c]">{job.title}</option>
              ))}
            </select>
            <textarea className="min-h-32 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/55 focus:border-[#f7c873]" placeholder="Bạn muốn kể thêm gì với Mộc Coffee?" />
            <button type="button" className="rounded-full bg-[#f7c873] px-6 py-4 font-black text-[#2b160c] transition hover:-translate-y-1 hover:bg-white">
              Gửi hồ sơ
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
