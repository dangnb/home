import BookingClient from "./BookingClient";

export const metadata = {
  title: "Book Appointment | Suli Salon",
  description: "Book your manicure, pedicure, or beauty treatment online.",
};

export default function BookingPage() {
  return (
    <main style={{ paddingTop: "120px", paddingBottom: "80px", backgroundColor: "var(--bg-color)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", textAlign: "center", color: "var(--text-dark)" }}>
          Book an Appointment
        </h1>
        <p style={{ textAlign: "center", color: "var(--text-gray)", marginBottom: "3rem" }}>
          Select your desired branch, service, and time to confirm your booking.
        </p>
        <BookingClient />
      </div>
    </main>
  );
}
