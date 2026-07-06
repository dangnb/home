"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { setupReveal } from "@/lib/animations";

export default function ServicesPreview() {
  useEffect(() => {
    setupReveal();
  }, []);

  return (
    <section className="py-32 px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <div className="mb-16 reveal">
          <span className="font-label-caps text-label-caps text-primary uppercase block mb-2">Salon Suli</span>
          <h2 className="font-display-lg text-display-lg max-w-2xl">Professional Manicure & Pedicure in Prague</h2>
          <div className="w-24 h-1 bg-primary mt-6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {[
            {
              title: "Nails",
              img: "https://lh3.googleusercontent.com/aida/AP1WRLsncxcUaLl-kRMraO4Z3lDzU_fTWPnoZq2Nu1fF9l-q2D54UsfpLvZepPtcS0B2zdHpDP019vTTziYl3Lsio_K0RghBV2Kd_31VlBu9YThyB2KfTE2ZzWVM0ChalCmLEx48YQMzPoQilLwQtKH3bk9r8zqYRRm1YjdXdQ4B8Z5Duf5JifHrDxt-Yqx-AJmBZ27EcKAtb5-sZbvqtdbRr6MeDpmlG4q0XU5CqOa9eJhvtE1RQdGItfyviGtS"
            },
            {
              title: "Facial Care",
              img: "https://lh3.googleusercontent.com/aida/AP1WRLvmBUkVHNFLX8ch_FNKHBzKDug9sqEhnNxXqV93sZFRO19ROp_KHIZJOu0aOeObsISyGxs8ds6u8tA0RdSFMfbTIuJx_dE3QmqPM7A938Ym1PnaAFzyFvoKmSn_BfngbhWM2PC1yB5e1GX2GFyzEQrRRPqYhu_d9uh_nVWI1VmGGuNjQB6-uGXWI6T2GRcPIp5751kYnxSCv-z92VVdYNtj7YmftrHK3skW7cZ-wwbVgQzBSADuCzI3f6Xc"
            },
            {
              title: "Eyelashes",
              img: "https://lh3.googleusercontent.com/aida/AP1WRLvvYMW4tC0WzVAhOd3ipWXpoh7jRs9wIx0S7K1Kdh7EKc8odCkT_vB5hQjabtivklH3nVceHH9wgUcWH3iDLFt7mmiBDAhlILRlH5LhzhmBVh_JXZE9LHvzpc_KbgOdYOzsV_AOCIfRRulpr5dcfiR4sJXnzOQz0NEyf2eG08NE3SOSgVzhZ3Il7MA3b_VYPaaBMyiTx14mdmC83Wea1IERfo5fjHZX7SMCQTMUSM3xPhn4WsK0Xs-Nczx-"
            },
            {
              title: "Eyebrows",
              img: "https://lh3.googleusercontent.com/aida/AP1WRLvA13tpO-MB-gIyzZ16CZpoWDDGRxtKCB_vF8CocOZAwA23iscVRX_ARLcroGFuJkq3LdD54fln74NTYIYQQdUrE9RHvVkCwUN70DfJDA8WIgcwkfS3v2AnTEAswCgPzsdn7Qf1kpACwunL2IGizrk3o4zH5o5ZlBG0Ih6DGy8dWJA2EulR902hDyUutORt9vc9zX2BHDHr6_uACENL1JJBN6mWsF5aTT6C-JqXwwOC4rkVMho0MuOgJziy"
            }
          ].map((service, idx) => (
            <div key={idx} className="group relative overflow-hidden h-[500px] whisper-shadow reveal" data-delay={(idx + 1) * 100}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={service.title} className="w-full h-full object-cover grayscale-luxury group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" src={service.img} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="font-headline-sm text-headline-sm text-white mb-2">{service.title}</h3>
                <Link href="/services" className="font-label-caps text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  VIEW DETAILS <span className="material-symbols-outlined ml-2 text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
