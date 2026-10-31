"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import TourSection from "@/components/TourSection";
import SeasonalCompass from "@/components/SeasonalCompass";
import DestinationGallery from "@/components/DestinationGallery";
import ManifestoSection from "@/components/ManifestoSection";
import TravelerPostcards from "@/components/TravelerPostcards";
import JournalSection from "@/components/JournalSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SlideOutBooking from "@/components/SlideOutBooking";
import FloatingButtons from "@/components/FloatingButtons";
import TourBookingModal from "@/components/TourBookingModal";
import ReelAutoPilot from "@/components/ReelAutoPilot";
import PageLoader from "@/components/PageLoader";

import toursData from "../../data/tours.json";
import categoriesData from "../../data/categories.json";
import journalData from "../../data/journal.json";
import settingsData from "../../data/settings.json";
import mediaData from "../../data/media.json";
import type { JournalArticle, SiteMedia, SiteSettings, Tour } from "@/types";

export default function HomePage() {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tours, setTours] = useState<Tour[]>(toursData as Tour[]);
  const [articles, setArticles] = useState<JournalArticle[]>(
    journalData as JournalArticle[]
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(
    settingsData as SiteSettings
  );
  const [siteMedia, setSiteMedia] = useState<SiteMedia>(
    mediaData as SiteMedia
  );

  useEffect(() => {
    fetch("/api/admin", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (Array.isArray(data.tours) && data.tours.length > 0) {
          setTours(data.tours);
        }
        if (Array.isArray(data.journal) && data.journal.length > 0) {
          setArticles(data.journal);
        }
        if (data.settings && data.settings.brandName) {
          setSiteSettings(data.settings);
        }
        if (data.media && Array.isArray(data.media.heroSlides)) {
          setSiteMedia(data.media);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenBooking = (tour: Tour) => {
    setSelectedTour(tour);
  };

  const handleViewDetails = (tour: Tour) => {
    setSelectedTour(tour);
  };

  const handleCloseModal = () => {
    setSelectedTour(null);
  };

  return (
    <>
      <PageLoader />
      <Navbar />

      <main>
        <Hero slides={siteMedia.heroSlides} />
        <IntroSection />
        <TourSection
          categories={categoriesData}
          tours={tours}
          onOpenBooking={handleOpenBooking}
          onViewDetails={handleViewDetails}
        />
        <SeasonalCompass
          tours={tours}
          onSelectTour={handleViewDetails}
        />
        <DestinationGallery destinations={siteMedia.destinations} />
        <ManifestoSection />
        <TravelerPostcards postcards={siteMedia.postcards} />
        <JournalSection articles={articles} />
        <ContactSection settings={siteSettings} />
      </main>

      <Footer settings={siteSettings} />

      <SlideOutBooking tours={tours} />
      <FloatingButtons
        hotline={siteSettings.hotline}
        zalo={siteSettings.zalo}
        messenger={siteSettings.messenger}
        facebook={siteSettings.socials?.facebook}
      />

      <AnimatePresence>
        {selectedTour && (
          <TourBookingModal
            key={selectedTour.id}
            tour={selectedTour}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>

      <ReelAutoPilot />
    </>
  );
}
