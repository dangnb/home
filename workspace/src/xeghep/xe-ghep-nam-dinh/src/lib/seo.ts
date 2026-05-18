import type { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
}

export function generateSEO({
  title,
  description,
  url = "https://xeghepnamdinh.vn",
  image = "/og-image.jpg",
  type = "website",
}: SEOProps): Metadata {
  return {
    title,
    description,
    keywords: [
      "xe ghép Nam Định",
      "xe ghép Hà Nội Nam Định",
      "xe tiện chuyến Nam Định",
      "taxi Nam Định Hà Nội",
      "xe ghép Nội Bài Nam Định",
      "xe ghép Nam Định giá rẻ",
      "đặt xe ghép Nam Định",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "Xe Ghép Nam Định",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: "vi_VN",
      type: type as "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Schema.org LocalBusiness structured data
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Xe Ghép Nam Định",
    description:
      "Dịch vụ xe ghép Nam Định Hà Nội, Nội Bài. Đưa đón tận nhà, giá trọn gói, xe đời mới.",
    url: "https://xeghepnamdinh.vn",
    telephone: "+84379803990",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Ngã tư bưu điện, TT Giao Thủy",
        addressLocality: "Nam Định",
        addressCountry: "VN",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Số 2A Văn Cao, P. Thụy Khê, Q. Tây Hồ",
        addressLocality: "Hà Nội",
        addressCountry: "VN",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: 20.2506,
      longitude: 106.1699,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "250000đ - 1300000đ",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "1250",
    },
  };
}

// Facebook Pixel script
export function getFacebookPixelScript(pixelId: string) {
  return `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
}

// TikTok Pixel script
export function getTikTokPixelScript(pixelId: string) {
  return `
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load('${pixelId}');
      ttq.page();
    }(window, document, 'ttq');
  `;
}

// Google Analytics / Google Ads script
export function getGoogleAnalyticsScript(gaId: string) {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  `;
}
