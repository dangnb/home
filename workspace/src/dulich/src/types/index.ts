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
  gallery?: string[];
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
  slug?: string;
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
  location?: string;
  locationEn?: string;
  pullQuote?: string;
  pullQuoteEn?: string;
  content?: string[];
  contentEn?: string[];
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

export interface HeroScene {
  id: string;
  placeVi: string;
  placeEn: string;
  captionVi: string;
  captionEn: string;
  image: string;
}

export interface DestinationPhoto {
  id: string;
  region: "bac" | "trung" | "nam" | string;
  regionLabelVi: string;
  regionLabelEn: string;
  nameVi: string;
  nameEn: string;
  provinceVi: string;
  provinceEn: string;
  seasonVi: string;
  seasonEn: string;
  timeOfDayVi: string;
  timeOfDayEn: string;
  storyVi: string;
  storyEn: string;
  image: string;
  spanWide?: boolean;
}

export interface PostcardItem {
  id: string;
  stampVi: string;
  stampEn: string;
  quoteTitleVi: string;
  quoteTitleEn: string;
  bodyVi: string;
  bodyEn: string;
  guestName: string;
  guestRoleVi: string;
  guestRoleEn: string;
}

export interface SiteMedia {
  heroSlides: HeroScene[];
  destinations: DestinationPhoto[];
  postcards: PostcardItem[];
}

