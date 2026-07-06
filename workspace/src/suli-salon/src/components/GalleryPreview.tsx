"use client";
import React, { useEffect } from "react";
import { setupReveal } from "@/lib/animations";

const images = [
  "https://lh3.googleusercontent.com/aida/AP1WRLvwaaw5PhO3q7G6GDm-putw-oyJ4EEbn-t5NS6uv8fh4RykIks2MCnU6YVn0LP4znv4-1Ff_mj37ahIxRupUrV04EuQUtSZn_U4YbPT5qj1t1ikz5Ym5ejg73mUtrzDpS5bUgofGaD0SOzi5B5rz2cHRhovsjuYLZq7I22Z-NF8nRexRXGv3eMfRKNjLeyFKijT84zHeHJ7og-qWZ3UUGl2GXgRVDYIlD6mN9JcpxPbjnclYXc1e017E8J4",
  "https://lh3.googleusercontent.com/aida/AP1WRLu-Kuik5OETZq4lu0EghInZt2VbvsE7SO6grA9jbUt1vVFlZeSq4Z5D4_VYEcri2MeQwieyKuuOwKNGh1RrADEHzO6oTSXneGIjC9WTdt9MTZjbVw9Dfeut0jM297W_8oQMiau9D29VtGcn5HYhS1KE0PscY0Pk_-SKLzjKunbjwdt3aaSdc5o3KScyjYLyG8ZUoHEKJi5gx0tQOcdnTdq_os56DBIfjfyW0IDsV85UHbTPQo0e4mF0CqE",
  "https://lh3.googleusercontent.com/aida/AP1WRLu1fGVg4xRMJDSvETLQP7xkqNrrWb1SvWN05-GieM3-R4fn_j1oClLTAzxsH81AiQvqB4_lLqajZIcRoqXKqZpdfUakgj5EGdbv5GyFllvotmZN0P8SsLWvJM2xZtv629BoNbVytQOLYnK-HvrNkCJ0Owbf-Qivxi_7a4TqndmgAb-fnMaZgh_ljcR4lCUbwC2vLs5mfUma1CTC_CevlyAmxVc-cPlO47W3yk8Xb7KdaGR2j6f2r7Cf3o1j",
  "https://lh3.googleusercontent.com/aida/AP1WRLtUavqc-jC-LLOjs3UygBxeP-uiX_OP6eEktrhOIMrnI5fnRjKV-NKc1sYXs2EtODATu_FyGsWvlq0MY0G9K3yVr4fJRETdBSF2LyVpgiK_8NdSptrcOs1cYowxmm4VDdV0yDSnyyeX6moFvbADLkJUyiRXv6XACPsS5ozj5PMzymB7pgQ8GVKsY68bLDX5casKWzD9BWwQSreIOG2AGNTibfLGciawZip-vmgywLjUYvc6poyU-aXJFlwx",
  "https://lh3.googleusercontent.com/aida/AP1WRLu9PIeHtdybqYje9-XuLPD2zCvagr4IMCs5LVuc_y8Ez35thKlG4M1UMPpUvtSWSDhC1vvsEZBaGISU__Vgs-OKWSWnnVP_turwO6Fbmxc_JUCrXyPNRdWh9aCsfGiTxNSLvbIj0_FcR9UbgtJbkOfniSJa7KasjvsMH_wmbTqQ_-9rXiH3DVnCJUcZcitlGCx47YcDFLzCf7_YgY1OLcqMk0OJPUFXY1qPcEvv0xiRieLCU-8HRvTiPTmH",
  "https://lh3.googleusercontent.com/aida/AP1WRLtmsK1ri2awsUDlsxNOePqAkTLwLwLUOJAlo3smMVsHzkNn_5j4jIfsrJoFTdvd53adUrcSLBcw1CtDlPJipxZ18E0-czkDx2Mfrz-r2KIXc_T_EpJ9ObPucPKXuQHr_09d7qTlT-qfOmUnIE8fGTjuDbNBp46pGH8k6TLZjeqAnhxs7azbLUcox11UAXfPICWLDLZRTuGw4_-XyFTVmm1xdlE33c-LY5VYtB7Pb6Q7irgFpeGkg7ymNEXZ",
  "https://lh3.googleusercontent.com/aida/AP1WRLvS9s73jrEia1Mx5bMDd9Ngr5MqBn3vZWoXj2Fet6y1YBrpN-GZpso9L0uG88DoR7_hWdd9xyTG5IGsdGPblAhsm7cRa5jTRcXFB2rNd7wTfBNwNVlfmtN0P6IpKtcUHkUnFb25oWkeD3idRM8WG8e23FP5pkB56z1bcuDYBTtYuOCzSP0vP0t4cjal3BDMgJIA1Y4JuivYyPnqzd1WDr4qJvLh48RxWHImA5tcnT6YK1_sdFK4dFdtaGL1",
  "https://lh3.googleusercontent.com/aida/AP1WRLsKkqquwhXD3_Huf74jW-lN7rjhJER_RMq-Gt_BgWSGI_xbuj6fM8wIyI3StJYILWB93JSK7Rr7uVSj21u8In0lMhW5s3MPMlg7JMYhd975p9K-dIrl2fEdGKgziPYOFxQbr_pfrCvMi-l6HpYXcrxrFfkrOcUoGEoZnqk43F38zuyQOuaJ4enUE9lUIBmFqdqNZS9Z8EEhGz9LG2pE8ILMWHYYAPTIlXxPUS4nOv-obBtL_cSMmvHWbD8",
  "https://lh3.googleusercontent.com/aida/AP1WRLtsBMKK-M55051aPGScceZ_Tkdf4nOCFP_l0zmXL9QGDmv-yByxA2XGaCEBXmrTkSLe2Ya7hX2Jvdv_nTMm6IReiM2QNbAlZOMiIMhtajusRja4hgkIuNV0sM9gac36FvFa03ms4qElfoH8RFMSWx1iSWtKV8fWFLQrPq6M0wMh-0gwpb_gwIi_lqEEwWsnTeNBDYV8CTiWVlUnu7lfYUCYTom2PezUnrIafPILsZJO_YpPzV-8ppVJTgY",
  "https://lh3.googleusercontent.com/aida/AP1WRLsXltZC6xTmj2q194Gevvzemzr1LPbEYo3XxaKnUuu8qIR3MzLn0xzDkfxPkShpPO7p5O010PTyNOMqnCgRfMxiQp83DC-3AWevtLEnuzwdSc0gnth6vH6w9iK7gPbL6lZMLafLiBDn7apxa4y9qvMregcrjGFFT7HzfdGHngUvzNzg0hIXVUgayRCZeFbOJk74ByOuhx5hW92K6z-OvoblYC01hkalpdkEXLstvzOmHddKJ9Tr6AeCsIyY"
];

export default function GalleryPreview() {
  useEffect(() => {
    setupReveal();
  }, []);

  return (
    <section className="py-32 bg-surface px-margin-desktop reveal">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-headline-md text-display-lg text-primary italic mb-2">Suli Salon</h2>
          <p className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">Luxury Nail Gallery in Prague</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px]">
          {/* Bento Gallery Items with Hover Interaction */}
          <div className="row-span-2 overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[0]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[1]} />
          </div>
          <div className="row-span-2 col-span-2 overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[2]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[3]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[4]} />
          </div>
          <div className="row-span-2 overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[5]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[6]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[7]} />
          </div>
          <div className="col-span-2 overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[8]} />
          </div>
          <div className="overflow-hidden hover:opacity-95 transition-opacity group">
            <img alt="Gallery" className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src={images[9]} />
          </div>
        </div>
      </div>
    </section>
  );
}
