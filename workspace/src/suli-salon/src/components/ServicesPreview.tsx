"use client";
import { useEffect } from "react";
import Link from "next/link";
import { setupReveal } from "@/lib/animations";
import { MdArrowForward } from "react-icons/md";

export default function ServicesPreview() {
  useEffect(() => {
    setupReveal();
  }, []);

  return (
    <section className="py-32 px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <div className="mb-16 reveal">
          <span className="font-label-caps text-label-caps text-primary uppercase block mb-2">Mộc Salon</span>
          <h2 className="font-display-lg text-display-lg max-w-2xl">Dịch Vụ Chăm Sóc Móng & Nail Art Chuyên Nghiệp</h2>
          <div className="w-24 h-1 bg-primary mt-6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {[
            {
              title: "Nails",
              img: "https://res.cloudinary.com/jawkxked/image/upload/v1791910442/moc-salon/intphywxofrojkd1eix7.jpg"
            },
            {
              title: "Facial Care",
              img: "https://res.cloudinary.com/jawkxked/image/upload/v1791910444/moc-salon/xeq1btt5gvpkzdsdjqir.jpg"
            },
            {
              title: "Eyelashes",
              img: "https://res.cloudinary.com/jawkxked/image/upload/v1791910446/moc-salon/hrzz84u08aqrlvhimgzk.jpg"
            },
            {
              title: "Eyebrows",
              img: "https://res.cloudinary.com/jawkxked/image/upload/v1791910439/moc-salon/pczutt3rlztnazddlwey.jpg"
            }
          ].map((service, idx) => (
            <div key={idx} className="group relative overflow-hidden h-[500px] whisper-shadow reveal" data-delay={(idx + 1) * 100}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" src={service.img} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="font-headline-sm text-headline-sm text-white mb-2">{service.title}</h3>
                <Link href="/services" className="font-label-caps text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  VIEW DETAILS <MdArrowForward className="ml-2 text-[16px]" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
