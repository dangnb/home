import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/Hero';
import FeaturedServices from '@/components/FeaturedServices';
import AboutUs from '@/components/AboutUs';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import News from '@/components/News';
import BookingForm from '@/components/BookingForm';

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;
  setRequestLocale(locale);

  return (
    <main className="flex-1 w-full flex flex-col">
      <Hero />
      <AboutUs />
      <FeaturedServices />
      <Gallery />
      <Testimonials />
      <News />
      <BookingForm />
    </main>
  );
}
