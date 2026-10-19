import { NextResponse } from "next/server";
import toursData from "../../../../data/tours.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");

  if (region && region !== "all") {
    const filtered = toursData.filter((t) => t.region === region);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(toursData);
}
