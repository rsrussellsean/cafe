// ─────────────────────────────────────────────────────────────
// Validation schemas, shared by the reservation/order forms and the API routes
// that back them. Input schemas describe what the UI may send; payload schemas
// re-assert the exact shape that goes out to n8n.
// ─────────────────────────────────────────────────────────────

import { z } from "zod";
import { manilaToday, withinDays } from "@/lib/time";

const MAX_BOOKING_DAYS = 180;

export const reservationInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),

  // Accept the way people actually type PH mobiles (spaces, dashes, +63) and
  // normalise before matching.
  phone: z
    .string()
    .trim()
    .transform((s) => s.replace(/[\s()-]/g, ""))
    .pipe(
      z
        .string()
        .regex(/^(09\d{9}|\+639\d{9})$/, "Enter a valid PH mobile number"),
    ),

  email: z.email("Enter a valid email address").max(120),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date")
    .refine((d) => d >= manilaToday(), "Pick a date from today onward")
    .refine(
      (d) => withinDays(d, MAX_BOOKING_DAYS),
      "Please book within the next 6 months",
    ),

  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Pick a time"),

  party_size: z.coerce
    .number()
    .int()
    .min(1, "At least one guest")
    .max(20, "For parties over 20, please call us"),

  notes: z.string().trim().max(500).default(""),

  // Honeypot: real customers never see this field, so anything in it is a bot.
  // Deliberately permissive — the route answers bots with a silent success
  // rather than a 400, so they learn nothing about which field trapped them.
  website: z.string().optional(),
});

export type ReservationInput = z.infer<typeof reservationInputSchema>;

export const orderInputSchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter a name").max(80),
  phone: z.string().trim().max(20).default(""),
  notes: z.string().trim().max(300).default(""),
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        qty: z.coerce.number().int().min(1).max(99),
        // Optional per-line requests ("extra shot", "less ice"). The bag has no
        // modifier concept, so these are collected at checkout only.
        modifiers: z.array(z.string().trim().min(1).max(60)).max(10).default([]),
      }),
    )
    .min(1, "Add at least one item to your bag")
    .max(50),
  /** Honeypot — see reservationInputSchema. */
  website: z.string().optional(),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

// Outbound shapes. These mirror lib/n8n/types.ts and exist so a typo in a
// payload builder fails loudly here rather than silently at the webhook.
export const reservationPayloadSchema = z.object({
  reservation_id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  date: z.string(),
  time: z.string(),
  party_size: z.number(),
  notes: z.string(),
});

export const orderPayloadSchema = z.object({
  order_id: z.string(),
  source: z.enum(["grabfood", "foodpanda"]),
  customer_name: z.string(),
  phone: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      qty: z.number(),
      modifiers: z.array(z.string()),
    }),
  ),
  total: z.number(),
  order_type: z.literal("delivery"),
  notes: z.string(),
  timestamp: z.string(),
});
