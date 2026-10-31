import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ArrowRightCircle } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const CATEGORIES = [
  'body-care', 'facial-care', 'herbal-hair-wash', 'eye-care',
  'rf-weight-loss', 'traditional-medicine-skin-care', 'acne-treatment',
  'melasma-treatment', 'safe-skin-whitening', 'full-body-massage',
  'permanent-hair-removal', 'cosmetic-tattooing', 'acne-treatment-process', 'waxing'
];

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;
  
  setRequestLocale(locale);

  if (!CATEGORIES.includes(slug)) {
    notFound();
  }

  const tCat = await getTranslations('ServiceCategories');
  const tCatPages = await getTranslations('CategoryPages');

  const pageTitle = tCat(slug as any);
  const readMoreText = tCatPages('readMore');

  const allServices = (await readDb('services')) || [];
  const categoryServices = allServices.filter((s: any) => s.category === slug);
  const displayServices = categoryServices.length > 0 ? categoryServices : allServices.slice(0, 3);

  return (
    <main className="flex-1 w-full bg-[#fcfcfc] pb-24 pt-16">
      <div className="container mx-auto px-4">
        
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-3xl font-bold text-[#b64b91] mb-4 uppercase tracking-wide">{pageTitle}</h1>
          <div className="w-20 h-0.5 bg-[#b64b91] mx-auto"></div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayServices.map((service: any, idx: number) => {
            const content = service[locale] || service['vi'] || {};
            return (
              <FadeIn key={service.id || idx} delay={idx * 0.15}>
                <div className="h-full bg-white overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all flex flex-col group border-b-4 border-transparent hover:border-[#b64b91]">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={service.image || '/spa_service.png'} 
                      alt={content.title || ''} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  
                  {/* Circular Avatar Overlap */}
                  <div className="relative flex justify-center -mt-12 mb-4 z-10">
                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                      <img src="/spa_avatar.png" alt="icon" className="w-full h-full rounded-full object-cover" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-8 pb-8 flex-grow flex flex-col text-center">
                    <h3 className="text-[1.1rem] font-bold text-gray-900 mb-4 uppercase leading-snug group-hover:text-[#b64b91] transition-colors">
                      {content.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-8 flex-grow leading-relaxed">
                      {content.excerpt}
                    </p>
                    
                    {/* Button */}
                    <Link 
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-[#a33b7e] hover:bg-[#b64b91] text-white font-medium py-2 px-6 rounded-sm transition-colors mx-auto text-sm shadow-sm"
                    >
                      {readMoreText}
                      <ArrowRightCircle className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </main>
  );
}
