import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const contactsFilePath = path.join(process.cwd(), "data", "contacts.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email là bắt buộc." }, { status: 400 });
    }

    const newContact = {
      id: "contact_" + Date.now(),
      email,
      createdAt: new Date().toISOString(),
    };

    let list = [];
    try {
      if (fs.existsSync(contactsFilePath)) {
        list = JSON.parse(fs.readFileSync(contactsFilePath, "utf8"));
      }
    } catch {
      list = [];
    }

    list.unshift(newContact);

    try {
      fs.writeFileSync(contactsFilePath, JSON.stringify(list, null, 2), "utf8");
    } catch {}

    return NextResponse.json({ success: true, contact: newContact });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lưu liên hệ." }, { status: 500 });
  }
}
