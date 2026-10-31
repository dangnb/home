import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronRight, Clock, Award, BookOpen } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TrainingPage(props: Props) {
  const params = await props.params;
  const { locale } = params;
  
  setRequestLocale(locale);

  const t = await getTranslations('Training');
  const tNav = await getTranslations('Navigation');

  const courses = (await readDb('training')) || [];

  return (
    <main className="flex-1 w-full bg-[#fcf9f5] pb-24">
      {/* Soft Botanical Hero Banner */}
      <section className="relative w-full min-h-[38vh] md:min-h-[44vh] flex items-center justify-center overflow-hidden bg-[#f4ece1]">
        <div className="absolute inset-0 z-0">
          <img src="/spa_service.png" alt={t('heading')} className="w-full h-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a2a29]/65 via-[#4d3739]/45 to-[#3a2a29]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f5] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight drop-shadow-xs">{t('heading')}</h1>
          <p className="text-base md:text-lg text-white/95 max-w-2xl mx-auto drop-shadow-xs">{t('description')}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#7a6863] mb-12">
          <Link href="/" className="hover:text-[#9e5a6b] transition-colors">{tNav('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#9e5a6b] font-semibold">{tNav('training')}</span>
        </nav>

        <FadeIn>
          <h2 className="text-3xl font-semibold text-[#3d312e] mb-8 text-center">{t('coursesTitle')}</h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course: any, idx: number) => {
            const content = course[locale] || course['vi'] || {};
            const title = content.title || '';
            const duration = course.duration || '';
            const level = content.level || '';
            const desc = content.excerpt || '';
            const price = course.price || '';

            return (
              <FadeIn key={course.id || idx} delay={idx * 0.15}>
                <div className="bg-white p-8 rounded-[2.25rem] shadow-[0_12px_36px_-15px_rgba(110,80,75,0.08)] border border-[#efe6dd] hover:shadow-[0_20px_44px_-12px_rgba(158,90,107,0.14)] transition-all duration-500 group h-full flex flex-col relative overflow-hidden">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-[#f7eef0] border border-[#ead6db] rounded-2xl flex items-center justify-center text-[#9e5a6b] group-hover:-translate-y-1 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="bg-[#f4ece1] text-[#6e5c57] border border-[#e6dcd2] px-4 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#c8a46e]" />
                      {level}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold text-[#3d312e] mb-3 group-hover:text-[#9e5a6b] transition-colors">{title}</h3>
                  <p className="text-[#6e5c57] text-base leading-relaxed flex-1 mb-8">{desc}</p>
                  
                  <div className="flex items-center justify-between border-t border-[#f3ece4] pt-6 mt-auto">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-[#7a6863] text-sm font-medium mb-1">
                        <Clock className="w-4 h-4 text-[#9e5a6b]" />
                        <span>{duration}</span>
                      </div>
                      <div className="font-semibold text-[#9e5a6b] text-xl">{price}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/training/${course.slug}`}
                        className="text-[#9e5a6b] font-medium hover:underline transition-all text-sm"
                      >
                        {t('common.viewDetails')}
                      </Link>
                      <Link 
                        href="/#contact"
                        className="bg-[#9e5a6b] text-white font-medium py-2.5 px-6 rounded-full hover:bg-[#874959] shadow-sm transition-all text-sm"
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
