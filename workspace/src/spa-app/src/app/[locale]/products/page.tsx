import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage(props: Props) {
  const params = await props.params;
  const { locale } = params;
  
  setRequestLocale(locale);

  const t = await getTranslations('Products');
  const tNav = await getTranslations('Navigation');
  const tCommon = await getTranslations('Services.common');

  // Hardcoded product keys matching the JSON structure we added
  const productKeys = ['serum', 'cream', 'sunscreen', 'cleanser'];

  return (
    <main className="flex-1 w-full bg-gray-50 pb-24">
      {/* Hero Banner */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/spa_gallery.png" alt={t('heading')} className="w-full h-full object-cover brightness-50" />
        </div>
        <div className="relative z-10 text-center px-4 mt-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-md">{t('heading')}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow">{t('description')}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">{tNav('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-semibold">{tNav('products')}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productKeys.map((key, idx) => {
            const name = t(`items.${key}.name`);
            const desc = t(`items.${key}.desc`);
            const price = t(`items.${key}.price`);
            
            // Dummy image based on index to differentiate
            const imagePath = idx % 2 === 0 ? '/spa_about.png' : '/spa_service.png';

            return (
              <FadeIn key={key} delay={idx * 0.15}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full group">
                  <div className="h-64 overflow-hidden relative">
                    <img src={imagePath} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{name}</h3>
                    <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">{desc}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <span className="font-bold text-xl text-primary">{price}</span>
                      <button className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* CTA Section */}
        <FadeIn delay={0.4}>
          <div className="mt-20 bg-primary/5 rounded-3xl p-12 text-center border border-primary/10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('cta.title')}</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{t('cta.description')}</p>
            <Link 
              href="/#contact"
              className="inline-flex items-center justify-center bg-primary text-white font-bold text-lg py-4 px-10 rounded-full hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              {t('cta.button')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
