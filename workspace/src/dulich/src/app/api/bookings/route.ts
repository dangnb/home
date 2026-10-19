import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const bookingsFilePath = path.join(process.cwd(), "data", "bookings.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, tourId, tourTitle, departureDate, guestsCount, notes, totalEstimatedPrice } = body;

    if (!customerName || !phone) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp họ tên và số điện thoại liên hệ." },
        { status: 400 }
      );
    }

    const newBooking = {
      id: "book_" + Date.now(),
      customerName,
      phone,
      tourId: tourId || null,
      tourTitle: tourTitle || null,
      departureDate: departureDate || null,
      guestsCount: guestsCount || 1,
      notes: notes || "",
      totalEstimatedPrice: totalEstimatedPrice || "",
      createdAt: new Date().toISOString(),
      status: "new",
    };

    let existingBookings = [];
    try {
      if (fs.existsSync(bookingsFilePath)) {
        const fileData = fs.readFileSync(bookingsFilePath, "utf8");
        existingBookings = JSON.parse(fileData);
      }
    } catch {
      existingBookings = [];
    }

    existingBookings.push(newBooking);

    try {
      fs.writeFileSync(bookingsFilePath, JSON.stringify(existingBookings, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not save to bookings.json:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Yêu cầu hành trình đã được ghi nhận. Đội ngũ Nếp Concierge sẽ liên hệ sớm nhất.",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tiếp nhận yêu cầu." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (fs.existsSync(bookingsFilePath)) {
      const fileData = fs.readFileSync(bookingsFilePath, "utf8");
      return NextResponse.json(JSON.parse(fileData));
    }
    return NextResponse.json([]);
  } catch {
    return NextResponse.json([]);
  }
}
