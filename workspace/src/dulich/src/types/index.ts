export interface TourItineraryItem {
  day: number;
  title: string;
  titleEn: string;
}

export interface Tour {
  id: string;
  slug: string;
  region: "bac" | "trung" | "nam" | string;
  regionLabel: string;
  regionLabelEn: string;
  location: string;
  duration: string;
  durationEn: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  badge?: string;
  badgeEn?: string;
  isFeatured?: boolean;
  isSale?: boolean;
  price: string;
  originalPrice?: string;
  priceNumeric: number;
  groupSize: string;
  groupSizeEn: string;
  transport: string;
  transportEn: string;
  image: string;
  gallery: string[];
  highlights: string[];
  highlightsEn: string[];
  itinerary: TourItineraryItem[];
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  count: number;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  readTime: string;
  readTimeEn: string;
  tag: string;
  tagEn: string;
  date: string;
  dateEn: string;
  excerpt: string;
  excerptEn: string;
  image: string;
  author: string;
  authorEn: string;
}

export interface SiteSettings {
  brandName: string;
  slogan: string;
  sloganEn: string;
  hotline: string;
  hotlineDisplay: string;
  zalo: string;
  messenger: string;
  email: string;
  address: string;
  addressEn: string;
  socials: {
    facebook: string;
    instagram: string;
  };
}

export interface BookingSubmission {
  customerName: string;
  phone: string;
  email?: string;
  tourId: string;
  tourTitle: string;
  departureDate: string;
  guestsCount: number;
  notes?: string;
  totalEstimatedPrice?: string;
}
