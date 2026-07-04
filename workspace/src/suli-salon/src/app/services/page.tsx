import ServicesClient from "./ServicesClient";
import { Suspense } from "react";

export const metadata = {
  title: "Services | Suli Salon",
  description: "Explore our professional nail, facial, eyelash, and eyebrow services.",
};

export default function ServicesPage() {
  return (
    <main style={{ paddingTop: "120px", paddingBottom: "80px", backgroundColor: "var(--bg-color)", minHeight: "100vh" }}>
      <div className="container">
        <h1 style={{ fontSize: "3rem", marginBottom: "2rem", color: "var(--text-dark)" }}>Our Services</h1>
        <Suspense fallback={<div>Loading services...</div>}>
          <ServicesClient />
        </Suspense>
      </div>
    </main>
  );
}
