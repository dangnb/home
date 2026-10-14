export type TranslationDictionary = {
  meta: {
    homeTitle: string; homeDescription: string; servicesTitle: string; servicesDescription: string;
    galleryTitle: string; galleryDescription: string; aboutTitle: string; aboutDescription: string;
    contactTitle: string; contactDescription: string; bookingTitle: string; bookingDescription: string;
    postsTitle: string; postsDescription: string; postNotFound: string; postFallbackDescription: string;
  };
  nav: { home: string; services: string; about: string; gallery: string; posts: string; contact: string; booking: string; openMenu: string; closeMenu: string; desktop: string; mobile: string; language: string };
  footer: { description: string; quickLinks: string; services: string; gallery: string; journal: string; about: string; booking: string; contact: string; contactInfo: string; hotline: string; address: string; email: string; hours: string; bookingTip: string; privacy: string; terms: string; safety: string };
  common: { home: string; bookNow: string; bookAppointment: string; submit: string; sending: string; close: string; viewImage: string; all: string; select: string; requiredFields: string; error: string; success: string; successMessage: string };
};
