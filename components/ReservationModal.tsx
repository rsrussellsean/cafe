"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import Dialog from "@/components/Dialog";
import { useReservation } from "@/lib/reservation-context";
import { submitReservation } from "@/lib/api/client";
import { manilaToday } from "@/lib/time";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  party_size: "2",
  notes: "",
  website: "",
};

const field =
  "w-full border-b border-ink/20 bg-transparent pb-3 text-base text-ink outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-forest";

const label =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50";

const times = [
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "20:15",
  "20:30",
  "20:45",
];

const formatTime = (time: string) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDate = (date: string) => {
  if (!date) return undefined;

  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const getToday = () => {
  const today = manilaToday();

  const [year, month, day] = today.split("-").map(Number);

  return new Date(year, month - 1, day);
};

export default function ReservationModal() {
  const { isOpen, close } = useReservation();

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const busy = status === "submitting";

  const set = (key: keyof typeof EMPTY) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: [] } : e));
  };

  const reset = () => {
    setForm(EMPTY);
    setStatus("idle");
    setMessage("");
    setConfirmed(false);
    setErrors({});
    setCalendarOpen(false);
    setTimeOpen(false);
    setGuestsOpen(false);
  };

  const handleClose = () => {
    close();

    if (status === "success") {
      window.setTimeout(reset, 250);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "submitting" || status === "success") return;

    setStatus("submitting");
    setMessage("Submitting reservation…");
    setErrors({});

    const result = await submitReservation({
      ...form,
      party_size: Number(form.party_size),
    });

    if (result.ok) {
      setStatus("success");
      setConfirmed(result.confirmed);
      setMessage(result.message);
      return;
    }

    setStatus("error");
    setMessage(result.message);
    setErrors(result.fieldErrors ?? {});
  };

  const err = (key: string) =>
    errors[key]?.[0] ? (
      <p className="mt-2 font-mono text-[11px] text-caramel">
        {errors[key]![0]}
      </p>
    ) : null;

  const selectedDate = parseDate(form.date);
  const today = getToday();

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title="Reserve a Table"
      size="lg"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-caramel">
        ✺ Book your seat
      </p>

      {status === "success" ? (
        <div className="py-6">
          <p className="mt-3 font-display text-2xl leading-tight tracking-tight">
            {message}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            {confirmed
              ? "Your table is booked — see you soon."
              : "We'll confirm by phone or email shortly. This is a reservation request, not a confirmed booking yet."}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-forest px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors duration-300 hover:bg-gold hover:text-forest-deep"
            >
              Done
            </button>

            <button
              type="button"
              onClick={reset}
              className="link-line font-mono text-xs uppercase tracking-[0.2em] text-forest"
            >
              Make another reservation
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-6">
          {/* NAME + PHONE */}
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="res-name">
                01 — Name
              </label>

              <input
                id="res-name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                className={`mt-3 ${field}`}
                placeholder="Your name"
              />

              {err("name")}
            </div>

            <div>
              <label className={label} htmlFor="res-phone">
                02 — Phone
              </label>

              <input
                id="res-phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
                className={`mt-3 ${field}`}
                placeholder="0917 123 4567"
              />

              {err("phone")}
            </div>
          </div>

          {/* EMAIL */}
          <div className="mt-8">
            <label className={label} htmlFor="res-email">
              03 — Email
            </label>

            <input
              id="res-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              className={`mt-3 ${field}`}
              placeholder="you@email.com"
            />

            {err("email")}
          </div>

          {/* DATE + TIME + GUESTS */}
          <div className="relative z-[80] mt-8 grid gap-8 sm:grid-cols-3">
            {/* DATE */}
            <div className="relative z-90">
              <label className={label} htmlFor="res-date">
                04 — Date
              </label>

              <button
                id="res-date"
                type="button"
                onClick={() => {
                  setCalendarOpen((open) => !open);
                  setTimeOpen(false);
                }}
                className={`mt-3 flex w-full items-center justify-between border-b border-ink/20 bg-transparent pb-3 text-left text-base outline-none transition-colors duration-300 hover:border-forest ${
                  form.date ? "text-ink" : "text-ink/30"
                }`}
              >
                <span>
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Select date"}
                </span>

                <svg
                  className="h-4 w-4 shrink-0 text-ink/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </button>

              {calendarOpen && (
                <div className="absolute left-0 top-full z-[999] mt-3 w-[min(340px,calc(100vw-3rem))] rounded-2xl border border-ink/10 bg-foam p-4 shadow-2xl shadow-forest-deep/10"> 
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={selectedDate ?? today}
                    disabled={{ before: today }}
                    onSelect={(date) => {
                      if (!date) return;

                      set("date")(formatDate(date));
                      setCalendarOpen(false);
                    }}
                    classNames={{
                      root: "w-full",
                      months: "w-full",
                      month: "w-full",
                      month_caption:
                        "flex items-center justify-center h-10 mb-2",
                      caption_label:
                        "font-display text-lg tracking-tight text-ink",
                      nav: "absolute right-2 top-4 flex items-center gap-1",
                      button_previous:
                        "h-8 w-8 rounded-full text-ink/50 hover:bg-ink/5 hover:text-ink transition-colors",
                      button_next:
                        "h-8 w-8 rounded-full text-ink/50 hover:bg-ink/5 hover:text-ink transition-colors",
                      weekdays: "grid grid-cols-7 mb-1",
                      weekday:
                        "text-center font-mono text-[9px] uppercase tracking-wider text-ink/35",
                      week: "grid grid-cols-7",
                      day: "relative flex items-center justify-center",
                      day_button:
                        "h-9 w-9 rounded-full font-mono text-xs text-ink transition-all hover:bg-forest/10",
                      selected:
                        "bg-forest text-foam hover:bg-forest hover:text-foam",
                      today:
                        "font-bold text-forest underline underline-offset-4",
                      outside: "text-ink/20",
                      disabled: "cursor-not-allowed text-ink/15",
                    }}
                  />
                </div>
              )}

              {err("date")}
            </div>

            {/* TIME */}
            <div className="relative z-90">
              <label className={label} htmlFor="res-time">
                05 — Time
              </label>

              <button
                id="res-time"
                type="button"
                onClick={() => {
                  setTimeOpen((open) => !open);
                  setCalendarOpen(false);
                }}
                className={`mt-3 flex w-full items-center justify-between border-b border-ink/20 bg-transparent pb-3 text-left text-base outline-none transition-colors duration-300 hover:border-forest ${
                  form.time ? "text-ink" : "text-ink/30"
                }`}
              >
                <span>
                  {form.time
                    ? formatTime(form.time)
                    : "Select time"}
                </span>

                <svg
                  className="h-4 w-4 shrink-0 text-ink/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </button>

              {timeOpen && (
                <div className="absolute left-0 top-full z-[999] mt-3 w-[min(340px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-ink/10 bg-foam shadow-2xl shadow-forest-deep/10">
                  <div className="border-b border-ink/10 px-5 py-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/40">
                      Select a time
                    </p>

                    <p className="mt-1 font-display text-xl text-ink">
                      {form.time
                        ? formatTime(form.time)
                        : "Choose your time"}
                    </p>
                  </div>

                  <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto p-4">
                    {times.map((time) => {
                      const selected = form.time === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            set("time")(time);
                            setTimeOpen(false);
                          }}
                          className={`rounded-xl px-3 py-2.5 font-mono text-xs transition-all ${
                            selected
                              ? "bg-forest text-foam"
                              : "bg-ink/[0.03] text-ink/70 hover:bg-forest/10 hover:text-forest"
                          }`}
                        >
                          {formatTime(time)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {err("time")}
            </div>

            {/* GUESTS */}
            <div className="relative z-[80]">
              <label className={label} htmlFor="res-party">
                06 — Guests
              </label>

              <button
                id="res-party"
                type="button"
                onClick={() => {
                  setGuestsOpen((open) => !open);
                  setCalendarOpen(false);
                  setTimeOpen(false);
                }}
                className={`mt-3 flex w-full items-center justify-between border-b border-ink/20 bg-transparent pb-3 text-left text-base outline-none transition-colors duration-300 hover:border-forest ${
                  form.party_size ? "text-ink" : "text-ink/30"
                }`}
                aria-haspopup="listbox"
                aria-expanded={guestsOpen}
              >
                <span>
                  {form.party_size}{" "}
                  {Number(form.party_size) === 1 ? "guest" : "guests"}
                </span>

                <svg
                  className={`h-4 w-4 shrink-0 text-ink/40 transition-transform ${
                    guestsOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {guestsOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 top-full z-[999] mt-3 max-h-64 w-full overflow-y-auto rounded-2xl border border-ink/10 bg-foam p-2 shadow-2xl shadow-forest-deep/10"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
                    const selected = form.party_size === String(n);

                    return (
                      <button
                        key={n}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          set("party_size")(String(n));
                          setGuestsOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-mono text-xs transition-colors ${
                          selected
                            ? "bg-forest text-foam"
                            : "text-ink/70 hover:bg-forest/10 hover:text-forest"
                        }`}
                      >
                        <span>
                          {n} {n === 1 ? "guest" : "guests"}
                        </span>

                        {selected && (
                          <span className="text-xs">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {err("party_size")}
            </div>
          </div>

          {/* NOTES */}
          <div className="mt-8">
            <label className={label} htmlFor="res-notes">
              07 — Notes{" "}
              <span className="normal-case tracking-normal">
                (optional)
              </span>
            </label>

            <textarea
              id="res-notes"
              rows={2}
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              className={`mt-3 resize-none ${field}`}
              placeholder="Window seat, birthday, allergies…"
            />

            {err("notes")}
          </div>

          {/* HONEYPOT */}
          <div className="hidden" aria-hidden>
            <label htmlFor="res-website">
              Website
            </label>

            <input
              id="res-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) =>
                set("website")(e.target.value)
              }
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={busy}
            aria-busy={busy}
            className="mt-9 w-full cursor-pointer rounded-full bg-forest px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors duration-300 hover:bg-gold hover:text-forest-deep disabled:opacity-60 disabled:hover:bg-forest disabled:hover:text-foam sm:w-auto"
          >
            {busy
              ? "Submitting…"
              : "Submit Reservation"}
          </button>

          {/* STATUS */}
          <p
            role="status"
            aria-live="polite"
            className={`mt-4 min-h-5 font-mono text-[11px] uppercase tracking-[0.2em] ${
              status === "error"
                ? "text-caramel"
                : "text-ink/50"
            }`}
          >
            {message}
          </p>
        </form>
      )}
    </Dialog>
  );
}