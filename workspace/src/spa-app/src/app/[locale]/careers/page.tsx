import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronRight, Briefcase, MapPin, Clock } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CareersPage(props: Props) {
  const params = await props.params;
  const { locale } = params;
  
  setRequestLocale(locale);

  const t = await getTranslations('Careers');
  const tNav = await getTranslations('Navigation');

  const jobs = ['therapist', 'receptionist', 'manager'];

  return (
    <main className="flex-1 w-full bg-gray-50 pb-24">
      {/* Hero Banner */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/spa_about.png" alt={t('heading')} className="w-full h-full object-cover brightness-50" />
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
          <span className="text-primary font-semibold">{tNav('careers')}</span>
        </nav>

        <FadeIn>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('openings')}</h2>
        </FadeIn>

        <div className="space-y-6">
          {jobs.map((jobKey, idx) => {
            const title = t(`jobs.${jobKey}.title`);
            const type = t(`jobs.${jobKey}.type`);
            const location = t(`jobs.${jobKey}.location`);
            const desc = t(`jobs.${jobKey}.desc`);

            return (
              <FadeIn key={jobKey} delay={idx * 0.15}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 font-medium">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                        <Briefcase className="w-4 h-4 text-primary" /> {type}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                        <MapPin className="w-4 h-4 text-primary" /> {location}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                        <Clock className="w-4 h-4 text-primary" /> Full-time
                      </span>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">{desc}</p>
                  </div>
                  <div className="mt-4 md:mt-0 w-full md:w-auto">
                    <Link 
                      href="/#contact"
                      className="block w-full text-center bg-primary/10 text-primary font-bold py-3 px-8 rounded-xl hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                    >
                      {t('applyNow')}
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
