import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ChevronRight, Clock, Award, CheckCircle2, BookOpen, GraduationCap } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const VALID_SLUGS = ['basic', 'advanced', 'body', 'management'];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export default async function TrainingDetailsPage(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;
  
  setRequestLocale(locale);

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  const t = await getTranslations('Training');
  const tNav = await getTranslations('Navigation');
  const tCommon = t.raw('common') as Record<string, string>;

  const title = t(`courses.${slug}.title`);
  const description = t(`courses.${slug}.desc`);
  const duration = t(`courses.${slug}.duration`);
  const level = t(`courses.${slug}.level`);
  const price = t(`courses.${slug}.price`);

  const benefits = t.raw(`courses.${slug}.benefits`) as string[];
  const curriculum = t.raw(`courses.${slug}.curriculum`) as { title: string, desc: string }[];

  const heroImage = slug === 'basic' ? '/spa_gallery.png' : slug === 'advanced' ? '/spa_service.png' : '/spa_about.png';

  return (
    <main className="flex-1 w-full bg-gray-50 pb-24">
      {/* Hero Banner */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt={title} className="w-full h-full object-cover brightness-50" />
        </div>
        <div className="relative z-10 text-center px-4 mt-16 max-w-4xl mx-auto">
          <span className="bg-primary/90 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase inline-block mb-6 shadow-sm">
            {level}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">{title}</h1>
          <p className="text-lg md:text-2xl text-white/90 drop-shadow-md leading-relaxed">{description}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">{tNav('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/training" className="hover:text-primary transition-colors">{tNav('training')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-semibold">{title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content: Left Column */}
          <div className="w-full lg:w-2/3">
            {/* Image Gallery / Visuals */}
            <FadeIn>
              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="h-64 rounded-3xl overflow-hidden shadow-sm">
                  <img src="/spa_service.png" alt="Training" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="h-64 rounded-3xl overflow-hidden shadow-sm">
                  <img src="/spa_about.png" alt="Practice" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-primary" /> {tCommon.benefits}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-16">
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

            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" /> {tCommon.curriculum}
              </h2>
            </FadeIn>
            <div className="space-y-6 mb-16">
              {curriculum.map((step, idx) => (
                <FadeIn key={idx} delay={0.1 * idx}>
                  <div className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 transition-colors group">
                    <div className="flex-shrink-0 w-14 h-14 bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors rounded-full flex items-center justify-center font-bold text-xl">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{step.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Sticky Sidebar: Right Column */}
          <div className="w-full lg:w-1/3">
            <FadeIn direction="left" delay={0.3}>
              <div className="sticky top-32 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">{tCommon.courseInfo}</h3>
                
                <div className="space-y-8 mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Clock className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Thời gian</p>
                      <p className="text-xl font-bold text-gray-900">{duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Học phí</p>
                      <p className="text-2xl font-bold text-primary">{price}</p>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/#contact"
                  className="block w-full bg-primary text-white text-center font-bold text-xl py-5 rounded-2xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  {t('enrollNow')}
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
}
