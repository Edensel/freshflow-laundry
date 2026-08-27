import { businessConfig } from "@/lib/business";
import { countOrdersForPickupSlot } from "@/lib/orders";

export type Slot = {
  value: string;
  label: string;
  remaining: number;
  capacity: number;
  available: boolean;
};

const weekdayPickupHours = [8, 10, 12, 14, 16];
const saturdayPickupHours = [9, 11, 13];

const formatter = new Intl.DateTimeFormat("en-KE", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Africa/Nairobi",
});

function dateWithKenyaHour(dateIso: string, hour: number) {
  const hourLabel = String(hour).padStart(2, "0");
  return new Date(`${dateIso}T${hourLabel}:00:00+03:00`);
}

function hoursForDate(dateIso: string) {
  const day = dateWithKenyaHour(dateIso, 12).getDay();

  if (day === 0) {
    return [];
  }

  if (day === 6) {
    return saturdayPickupHours;
  }

  return weekdayPickupHours;
}

export function isSlotInsideOperatingHours(value: string) {
  const date = new Date(value);
  const kenyaDate = date.toLocaleDateString("en-CA", {
    timeZone: "Africa/Nairobi",
  });
  const hour = Number(
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Africa/Nairobi",
    }),
  );

  return hoursForDate(kenyaDate).includes(hour);
}

export async function getAvailableSlots(dateIso: string): Promise<Slot[]> {
  const hours = hoursForDate(dateIso);
  const now = Date.now();

  return Promise.all(
    hours.map(async (hour) => {
      const date = dateWithKenyaHour(dateIso, hour);
      const value = date.toISOString();
      const load = await countOrdersForPickupSlot(value);
      const capacity = businessConfig.slotCapacity;
      const remaining = Math.max(capacity - load, 0);

      return {
        value,
        label: formatter.format(date),
        remaining,
        capacity,
        available: remaining > 0 && date.getTime() > now + 60 * 60 * 1000,
      };
    }),
  );
}

export function defaultDateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toLocaleDateString("en-CA", {
    timeZone: "Africa/Nairobi",
  });
}
