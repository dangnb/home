import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronRight, Clock, Award, BookOpen } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TrainingPage(props: Props) {
  const params = await props.params;
  const { locale } = params;
  
  setRequestLocale(locale);

  const t = await getTranslations('Training');
  const tNav = await getTranslations('Navigation');

  const courses = ['basic', 'advanced', 'body', 'management'];

  return (
    <main className="flex-1 w-full bg-gray-50 pb-24">
      {/* Hero Banner */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/spa_service.png" alt={t('heading')} className="w-full h-full object-cover brightness-50" />
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
          <span className="text-primary font-semibold">{tNav('training')}</span>
        </nav>

        <FadeIn>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('coursesTitle')}</h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((courseKey, idx) => {
            const title = t(`courses.${courseKey}.title`);
            const duration = t(`courses.${courseKey}.duration`);
            const level = t(`courses.${courseKey}.level`);
            const desc = t(`courses.${courseKey}.desc`);
            const price = t(`courses.${courseKey}.price`);

            return (
              <FadeIn key={courseKey} delay={idx * 0.15}>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:-translate-y-2 transition-transform">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm">
                      <Award className="w-4 h-4" />
                      {level}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed flex-1 mb-8">{desc}</p>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-auto">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-gray-500 font-medium mb-1">
                        <Clock className="w-5 h-5 text-primary" />
                        <span>{duration}</span>
                      </div>
                      <div className="font-bold text-primary text-xl">{price}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/training/${courseKey}`}
                        className="text-primary font-semibold hover:underline transition-all"
                      >
                        {t('common.viewDetails')}
                      </Link>
                      <Link 
                        href="/#contact"
                        className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        {t('enrollNow')}
                      </Link>
                    </div>
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
