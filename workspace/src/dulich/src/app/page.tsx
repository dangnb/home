"use client";

import React, { useState } from "react";
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

import toursData from "../../data/tours.json";
import categoriesData from "../../data/categories.json";
import journalData from "../../data/journal.json";
import settingsData from "../../data/settings.json";
import type { Tour } from "@/types";

export default function HomePage() {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

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
      <Navbar />

      <main>
        <Hero />
        <IntroSection />
        <TourSection
          categories={categoriesData}
          tours={toursData as Tour[]}
          onOpenBooking={handleOpenBooking}
          onViewDetails={handleViewDetails}
        />
        <SeasonalCompass
          tours={toursData as Tour[]}
          onSelectTour={handleViewDetails}
        />
        <DestinationGallery />
        <ManifestoSection />
        <TravelerPostcards />
        <JournalSection articles={journalData} />
        <ContactSection />
      </main>

      <Footer />

      <SlideOutBooking tours={toursData as Tour[]} />
      <FloatingButtons
        hotline={settingsData.hotline}
        zalo={settingsData.zalo}
        messenger={settingsData.messenger}
        facebook={settingsData.socials?.facebook}
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
    </>
  );
}
