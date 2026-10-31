import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronRight, Briefcase, MapPin, Clock } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CareersPage(props: Props) {
  const params = await props.params;
  const { locale } = params;
  
  setRequestLocale(locale);

  const t = await getTranslations('Careers');
  const tNav = await getTranslations('Navigation');

  const jobs = (await readDb('careers')) || [];

  return (
    <main className="flex-1 w-full bg-[#fcf9f5] pb-24">
      {/* Soft Botanical Hero Banner */}
      <section className="relative w-full min-h-[38vh] md:min-h-[44vh] flex items-center justify-center overflow-hidden bg-[#f4ece1]">
        <div className="absolute inset-0 z-0">
          <img src="/spa_about.png" alt={t('heading')} className="w-full h-full object-cover opacity-85" />
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
          <span className="text-[#9e5a6b] font-semibold">{tNav('careers')}</span>
        </nav>

        <FadeIn>
          <h2 className="text-3xl font-semibold text-[#3d312e] mb-8">{t('openings')}</h2>
        </FadeIn>

        <div className="space-y-6">
          {jobs.map((job: any, idx: number) => {
            const content = job[locale] || job['vi'] || {};
            const title = content.title || '';
            const type = job.type || 'Full-time';
            const location = job.location || '';
            const desc = content.excerpt || '';

            return (
              <FadeIn key={job.id || idx} delay={idx * 0.15}>
                <div className="bg-white p-8 rounded-[2rem] shadow-[0_12px_36px_-15px_rgba(110,80,75,0.08)] border border-[#efe6dd] hover:shadow-[0_18px_40px_-12px_rgba(158,90,107,0.14)] transition-all group flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-[#3d312e] mb-3 group-hover:text-[#9e5a6b] transition-colors">{title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#6e5c57] mb-4 font-medium">
                      <span className="flex items-center gap-1.5 bg-[#fcf9f5] border border-[#efe6dd] px-3.5 py-1.5 rounded-full">
                        <Briefcase className="w-4 h-4 text-[#9e5a6b]" /> {type}
                      </span>
                      <span className="flex items-center gap-1.5 bg-[#fcf9f5] border border-[#efe6dd] px-3.5 py-1.5 rounded-full">
                        <MapPin className="w-4 h-4 text-[#9e5a6b]" /> {location}
                      </span>
                      <span className="flex items-center gap-1.5 bg-[#fcf9f5] border border-[#efe6dd] px-3.5 py-1.5 rounded-full">
                        <Clock className="w-4 h-4 text-[#9e5a6b]" /> {type}
                      </span>
                    </div>
                    <p className="text-[#6e5c57] text-base leading-relaxed">{desc}</p>
                  </div>
                  <div className="mt-4 md:mt-0 w-full md:w-auto">
                    <Link 
                      href="/#contact"
                      className="block w-full text-center bg-[#f7eef0] text-[#9e5a6b] border border-[#ead6db] font-medium py-3 px-8 rounded-full hover:bg-[#9e5a6b] hover:text-white transition-all whitespace-nowrap"
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
