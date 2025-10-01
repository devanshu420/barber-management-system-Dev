"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Example bookings data (replace with real data/fetch later)
const bookings = [
	{
		id: 1,
		barber: "John Doe",
		date: "2024-06-15",
		time: "10:00 AM",
		service: "Haircut",
		status: "Confirmed",
	},
	{
		id: 2,
		barber: "Jane Smith",
		date: "2024-06-18",
		time: "2:30 PM",
		service: "Shave",
		status: "Pending",
	},
];

export default function MyBookingsPage() {
	const router = useRouter();
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [showDetails, setShowDetails] = useState(false);

	const handleViewDetails = (booking) => {
		setSelectedBooking(booking);
		setShowDetails(true);
	};

	const handleCloseDetails = () => {
		setShowDetails(false);
		setSelectedBooking(null);
	};

	const handleCancel = (id) => {
		alert(`Booking #${id} cancelled!`);
		// TODO: Implement cancel logic (API call)
		handleCloseDetails();
	};

	const handleReschedule = (id) => {
		alert(`Booking #${id} reschedule requested!`);
		// TODO: Implement reschedule logic (API call or redirect to reschedule page)
		handleCloseDetails();
	};

	return (
		<div className="max-w-2xl mx-auto mt-16 p-8 border rounded-lg bg-white shadow">
			<button
				className="mb-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
				onClick={() => router.push("/services")}
			>
				&#8592; Back to Services
			</button>
			<h1 className="text-3xl font-bold mb-6 text-primary">My Bookings</h1>
			{bookings.length === 0 ? (
				<p className="text-muted-foreground">You have no bookings yet.</p>
			) : (
				<ul className="space-y-6">
					{bookings.map((booking) => (
						<li
							key={booking.id}
							className="border rounded-lg p-5 bg-gray-50 hover:bg-gray-100 transition"
						>
							<div className="flex justify-between items-center mb-2">
								<span className="font-semibold text-lg text-accent">
									{booking.service}
								</span>
								<span
									className={`px-3 py-1 rounded text-xs font-bold ${
										booking.status === "Confirmed"
											? "bg-green-100 text-green-700"
											: "bg-yellow-100 text-yellow-700"
									}`}
								>
									{booking.status}
								</span>
							</div>
							<div className="text-sm text-muted-foreground mb-2">
								<span className="mr-4">
									<strong>Barber:</strong> {booking.barber}
								</span>
								<span className="mr-4">
									<strong>Date:</strong> {booking.date}
								</span>
								<span>
									<strong>Time:</strong> {booking.time}
								</span>
							</div>
							<div className="flex gap-2">
								<button
									className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
									onClick={() => handleViewDetails(booking)}
								>
									View Details
								</button>
								<button
									className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
									onClick={() => handleCancel(booking.id)}
								>
									Cancel
								</button>
								<button
									className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
									onClick={() => handleReschedule(booking.id)}
								>
									Reschedule
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
			{/* Booking Details Modal */}
			{showDetails && selectedBooking && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
						<button
							className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
							onClick={handleCloseDetails}
						>
							&#10005;
						</button>
						<h2 className="text-xl font-bold mb-4 text-primary">
							Booking Details
						</h2>
						<p>
							<strong>Service:</strong> {selectedBooking.service}
						</p>
						<p>
							<strong>Barber:</strong> {selectedBooking.barber}
						</p>
						<p>
							<strong>Date:</strong> {selectedBooking.date}
						</p>
						<p>
							<strong>Time:</strong> {selectedBooking.time}
						</p>
						<p>
							<strong>Status:</strong> {selectedBooking.status}
						</p>
						<div className="flex gap-2 mt-6">
							<button
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
								onClick={() => handleCancel(selectedBooking.id)}
							>
								Cancel Booking
							</button>
							<button
								className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
								onClick={() => handleReschedule(selectedBooking.id)}
							>
								Reschedule
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
