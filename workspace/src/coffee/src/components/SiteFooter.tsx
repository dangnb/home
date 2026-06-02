import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ead8c5] bg-[#2b160c] text-[#f9ead8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-black text-white">Mộc Coffee</p>
          <p className="mt-4 max-w-md leading-7 text-[#d9bfa5]">
            Không gian cà phê trẻ trung cho những cuộc hẹn, buổi làm việc sáng tạo và ly đồ uống được pha bằng nhiều tâm huyết.
          </p>
        </div>
        <div>
          <p className="font-black text-white">Khám phá</p>
          <div className="mt-4 flex flex-col gap-3 text-[#d9bfa5]">
            <Link href="/about" className="transition hover:text-white">Về chúng mình</Link>
            <Link href="/products" className="transition hover:text-white">Thực đơn</Link>
            <Link href="/recruitment" className="transition hover:text-white">Tuyển dụng</Link>
          </div>
        </div>
        <div>
          <p className="font-black text-white">Ghé quán</p>
          <div className="mt-4 space-y-3 text-[#d9bfa5]">
            <p>24 Đường Hương Cà Phê, Quận 1</p>
            <p>08:00 - 22:30 mỗi ngày</p>
            <p>hello@moccoffee.vn</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
