import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ChevronRight, Calendar, ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const VALID_SLUGS = ['post1', 'post2', 'post3'];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export default async function NewsDetailsPage(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;
  
  setRequestLocale(locale);

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  const t = await getTranslations('NewsDetails');
  const tNav = await getTranslations('Navigation');
  const tCommon = await getTranslations('NewsDetails.common');

  const title = t(`${slug}.title`);
  const date = t(`${slug}.date`);
  const author = t(`${slug}.author`);
  const contentArray = t.raw(`${slug}.content`) as string[];

  return (
    <main className="flex-1 w-full bg-white pb-32">
      {/* Cover Image */}
      <section className="w-full h-[50vh] md:h-[65vh] relative">
        <img src="/spa_news.png" alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16 md:pb-24 max-w-4xl">
            <div className="bg-primary/90 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full text-white text-sm font-bold mb-6 flex items-center gap-2 shadow-lg">
              <Calendar className="w-4 h-4" /> {date}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8 drop-shadow-lg">
              {title}
            </h1>
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src="/spa_avatar.png" alt={author} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-lg">{author}</p>
                <p className="text-white/70 text-sm">Ngọc Hương Spa & Clinic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-12 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-14">
          <Link href="/" className="hover:text-primary transition-colors font-medium">{tNav('home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/#news" className="hover:text-primary transition-colors font-medium">{tNav('news')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-bold truncate max-w-[200px] md:max-w-md">{title}</span>
        </nav>

        {/* Content Body */}
        <article className="prose prose-lg md:prose-xl max-w-none text-gray-700">
          {contentArray.map((paragraph, idx) => {
            // Simple markdown-like bold parsing: **bold**
            const parts = paragraph.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={idx} className="mb-8 leading-relaxed text-[1.1rem] md:text-[1.25rem]">
                {parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-gray-900 font-extrabold text-[1.2rem] md:text-[1.35rem] block mt-12 mb-4">{part.slice(2, -2)}</strong>;
                  }
                  // Handle line breaks within the string
                  return part.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < part.split('\n').length - 1 && <br />}
                    </span>
                  ));
                })}
              </p>
            );
          })}
        </article>

        {/* Footer actions */}
        <div className="mt-20 pt-10 border-t border-gray-200 flex justify-between items-center">
          <Link href="/#news" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors text-lg">
            <ArrowLeft className="w-5 h-5" /> {tCommon('back')}
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-500 font-semibold hidden md:inline-block">Share:</span>
            <a href="#" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all shadow-sm hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
