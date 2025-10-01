"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ConfirmBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const barberId = searchParams.get("barberId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Booking Confirmation</h1>
      <p>Barber ID: {barberId}</p>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
      <p className="mt-4 text-green-600 font-semibold">Your appointment has been selected!</p>
      <button
        className="mt-8 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        onClick={() => router.push("/my-bookings")}
      >
        View My Bookings
      </button>
    </div>
  );
}
