import { getAvailableSlots } from "@/lib/slots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "Valid date is required." }, { status: 400 });
  }

  const slots = await getAvailableSlots(date);

  return Response.json({ slots });
}
