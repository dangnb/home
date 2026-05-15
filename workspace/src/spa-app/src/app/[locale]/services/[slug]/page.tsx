import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ChevronRight, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// valid slugs for static generation
const VALID_SLUGS = ['facial', 'massage', 'laser', 'thai-chi', 'phuc-hoi-da', 'thai-doc'];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export default async function ServiceDetailsPage(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;
  
  setRequestLocale(locale);

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  const t = await getTranslations('Services');
  const tNav = await getTranslations('Navigation');
  const tCommon = await getTranslations('Services.common');

  // We have dynamic keys based on slug
  const title = t(`${slug}.title`);
  const description = t(`${slug}.description`);
  const duration = t(`${slug}.duration`);
  const price = t(`${slug}.price`);

  const benefits = t.raw(`${slug}.benefits`) as string[];
  const steps = t.raw(`${slug}.steps`) as { title: string, desc: string }[];

  const heroImage = slug === 'facial' ? '/spa_service.png' : slug === 'massage' ? '/spa_about.png' : '/spa_gallery.png';

  return (
    <main className="flex-1 w-full bg-gray-50 pb-24">
      {/* Hero Banner */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt={title} className="w-full h-full object-cover brightness-50" />
        </div>
        <div className="relative z-10 text-center px-4 mt-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-md">{title}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow">{description}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">{tNav('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/#services" className="hover:text-primary transition-colors">{tNav('services')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-semibold">{title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content: Left Column */}
          <div className="w-full lg:w-2/3">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{tCommon('procedure')}</h2>
            </FadeIn>
            
            <div className="space-y-8 mb-16">
              {steps.map((step, idx) => (
                <div key={idx}>
                  <FadeIn delay={0.1 * idx}>
                    <div className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-2xl">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">{step.desc}</p>
                      </div>
                    </div>
                  </FadeIn>

                  {/* Inject a beautiful image halfway through the steps for professional look */}
                  {idx === Math.floor(steps.length / 2) - 1 && (
                    <FadeIn delay={0.2} className="mt-8 mb-2">
                      <div className="w-full h-[300px] rounded-2xl overflow-hidden shadow-md">
                        <img 
                          src="/spa_about.png" 
                          alt="Spa Procedure" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                    </FadeIn>
                  )}
                </div>
              ))}
            </div>

            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{tCommon('benefits')}</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10 hover:shadow-md transition-shadow">
                <ul className="space-y-5">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <CheckCircle2 className="w-7 h-7 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          {/* Sticky Sidebar: Right Column */}
          <div className="w-full lg:w-1/3">
            <FadeIn direction="left" delay={0.3}>
              <div className="sticky top-32 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                
                <div className="space-y-8 mb-10 mt-4">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Clock className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">{tCommon('duration')}</p>
                      <p className="text-2xl font-bold text-gray-900">{duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <DollarSign className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">{tCommon('price')}</p>
                      <p className="text-2xl font-bold text-gray-900">{price}</p>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/#contact"
                  className="block w-full bg-primary text-white text-center font-bold text-xl py-5 rounded-2xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  {tCommon('bookNow')}
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Related Services */}
      <section className="container mx-auto px-4 mt-24 mb-12">
        <FadeIn>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{tCommon('related')}</h2>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VALID_SLUGS.filter(s => s !== slug).slice(0, 3).map((relSlug, idx) => {
            const relTitle = t(`${relSlug}.title`);
            const relDesc = t(`${relSlug}.description`);
            const relPrice = t(`${relSlug}.price`);
            const relImage = relSlug === 'facial' ? '/spa_service.png' : relSlug === 'massage' ? '/spa_about.png' : '/spa_gallery.png';

            return (
              <FadeIn key={relSlug} delay={idx * 0.15}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full group">
                  <div className="h-48 overflow-hidden">
                    <img src={relImage} alt={relTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{relTitle}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{relDesc}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <span className="font-bold text-primary">{relPrice}</span>
                      <Link href={`/services/${relSlug}`} className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors flex items-center gap-1">
                        {tCommon('viewMore')} <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </main>
  );
}
