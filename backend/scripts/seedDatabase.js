// const mongoose = require('mongoose');
// const Booking = require('../models/Booking');
// require('dotenv').config();

// // Sample data generator
// const sampleBookings = [
//   {
//     shopId: '673a1f4b2c5e8d9a0f1b2c3d',
//     customer: 'Rajesh Kumar',
//     customerName: 'Rajesh Kumar',
//     service: 'Hair Cut',
//     serviceName: 'Hair Cut',
//     date: new Date('2025-11-15'),
//     bookingDate: new Date('2025-11-15'),
//     time: '10:30 AM',
//     bookingTime: '10:30 AM',
//     phone: '9876543210',
//     customerPhone: '9876543210',
//     price: 300,
//     amount: 300,
//     status: 'confirmed',
//     notes: 'Regular customer',
//   },
//   {
//     shopId: '673a1f4b2c5e8d9a0f1b2c3d',
//     customer: 'Priya Singh',
//     customerName: 'Priya Singh',
//     service: 'Beard Trim',
//     serviceName: 'Beard Trim',
//     date: new Date('2025-11-16'),
//     bookingDate: new Date('2025-11-16'),
//     time: '02:00 PM',
//     bookingTime: '02:00 PM',
//     phone: '9123456789',
//     customerPhone: '9123456789',
//     price: 150,
//     amount: 150,
//     status: 'pending',
//     notes: 'First time customer',
//   },
//   {
//     shopId: '673a1f4b2c5e8d9a0f1b2c3d',
//     customer: 'Arjun Patel',
//     customerName: 'Arjun Patel',
//     service: 'Hair Wash + Cut',
//     serviceName: 'Hair Wash + Cut',
//     date: new Date('2025-11-17'),
//     bookingDate: new Date('2025-11-17'),
//     time: '11:15 AM',
//     bookingTime: '11:15 AM',
//     phone: '9234567890',
//     customerPhone: '9234567890',
//     price: 450,
//     amount: 450,
//     status: 'pending',
//     notes: '',
//   },
//   {
//     shopId: '673a1f4b2c5e8d9a0f1b2c3d',
//     customer: 'Vikram Desai',
//     customerName: 'Vikram Desai',
//     service: 'Hair Cut',
//     serviceName: 'Hair Cut',
//     date: new Date('2025-11-18'),
//     bookingDate: new Date('2025-11-18'),
//     time: '03:45 PM',
//     bookingTime: '03:45 PM',
//     phone: '9345678901',
//     customerPhone: '9345678901',
//     price: 300,
//     amount: 300,
//     status: 'cancelled',
//     notes: 'Cancelled by customer',
//   },
// ];

// async function seedDatabase() {
//   try {
//     await mongoose.connect(
//       process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershops',
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );

//     // Clear existing bookings
//     await Booking.deleteMany({});
//     console.log('🗑️ Cleared existing bookings');

//     // Insert sample bookings
//     const result = await Booking.insertMany(sampleBookings);
//     console.log(`✅ Created ${result.length} sample bookings`);

//     // Display inserted bookings
//     const allBookings = await Booking.find({});
//     console.log('\n📋 All Bookings:');
//     console.table(allBookings);

//     await mongoose.connection.close();
//     console.log('\n✅ Database seeded successfully!');
//   } catch (err) {
//     console.error('❌ Error seeding database:', err);
//     process.exit(1);
//   }
// }

// seedDatabase();


// // import mongoose from "mongoose";
// // import dotenv from "dotenv";
// // import bcrypt from "bcryptjs";
// // import User from "../models/User.js";
// // import Barber from "../models/BarberShop.js";
// // import Service from "../models/Service.js";
// // import Booking from "../models/Booking.js";
// // import BarbershopLocation from "../models/BarbershopLocation.js";
// // import Notification from "../models/Notification.js";

// // dotenv.config();

// // const seedDatabase = async () => {
// //   try {
// //     await mongoose.connect(process.env.MONGODB_URI);
// //     console.log("✅ MongoDB connected successfully");

// //     // Clear old data
// //     console.log("🧹 Clearing existing data...");
// //     await Promise.all([
// //       User.deleteMany({}),
// //       Barber.deleteMany({}),
// //       Service.deleteMany({}),
// //       Booking.deleteMany({}),
// //       BarbershopLocation.deleteMany({}),
// //       Notification.deleteMany({}),
// //     ]);
// //     console.log("✅ Database cleared");

// //     // --- 1️⃣ Create Barbers ---
// //     const barbersData = [
// //       {
// //         name: "Rajesh Kumar",
// //         email: "rajesh@barber.com",
// //         phone: "+91-9876543220",
// //         password: await bcrypt.hash("password123", 10),
// //         role: "barber",
// //         experienceYears: 8,
// //         rating: 4.8,
// //         totalBookings: 250,
// //         avatar: "https://via.placeholder.com/150x150?text=Rajesh",
// //         isVerified: true,
// //         isActive: true,
// //       },
// //       {
// //         name: "Priya Singh",
// //         email: "priya@barber.com",
// //         phone: "+91-9876543221",
// //         password: await bcrypt.hash("password123", 10),
// //         role: "barber",
// //         experienceYears: 6,
// //         rating: 4.6,
// //         totalBookings: 180,
// //         avatar: "https://via.placeholder.com/150x150?text=Priya",
// //         isVerified: true,
// //         isActive: true,
// //       },
// //       {
// //         name: "Amit Patel",
// //         email: "amit@barber.com",
// //         phone: "+91-9876543222",
// //         password: await bcrypt.hash("password123", 10),
// //         role: "barber",
// //         experienceYears: 10,
// //         rating: 4.9,
// //         totalBookings: 320,
// //         avatar: "https://via.placeholder.com/150x150?text=Amit",
// //         isVerified: true,
// //         isActive: true,
// //       },
// //       {
// //         name: "Neha Verma",
// //         email: "neha@barber.com",
// //         phone: "+91-9876543223",
// //         password: await bcrypt.hash("password123", 10),
// //         role: "barber",
// //         experienceYears: 5,
// //         rating: 4.5,
// //         totalBookings: 150,
// //         avatar: "https://via.placeholder.com/150x150?text=Neha",
// //         isVerified: true,
// //         isActive: true,
// //       },
// //       {
// //         name: "Vikram Singh",
// //         email: "vikram@barber.com",
// //         phone: "+91-9876543224",
// //         password: await bcrypt.hash("password123", 10),
// //         role: "barber",
// //         experienceYears: 12,
// //         rating: 4.9,
// //         totalBookings: 450,
// //         avatar: "https://via.placeholder.com/150x150?text=Vikram",
// //         isVerified: true,
// //         isActive: true,
// //       },
// //     ];

// //     const barbers = await Barber.insertMany(barbersData);
// //     console.log(`💈 Created ${barbers.length} barbers`);

// //     // --- 2️⃣ Create Services ---
// //     const servicesData = [
// //       {
// //         serviceName: "Haircut",
// //         category: "Hair",
// //         price: 300,
// //         duration: 30,
// //       },
// //       {
// //         serviceName: "Beard Trim",
// //         category: "Beard",
// //         price: 200,
// //         duration: 20,
// //       },
// //       {
// //         serviceName: "Hair Wash & Cut",
// //         category: "Hair",
// //         price: 400,
// //         duration: 45,
// //       },
// //       {
// //         serviceName: "Full Grooming",
// //         category: "Full Service",
// //         price: 600,
// //         duration: 60,
// //       },
// //       {
// //         serviceName: "Hair Coloring",
// //         category: "Hair",
// //         price: 800,
// //         duration: 90,
// //       },
// //       {
// //         serviceName: "Beard Oil Treatment",
// //         category: "Beard",
// //         price: 150,
// //         duration: 15,
// //       },
// //     ];

// //     // Assign barberId for each service
// //     servicesData.forEach((service, index) => {
// //       service.barberId = barbers[index % barbers.length]._id;
// //     });

// //     const services = await Service.insertMany(servicesData);
// //     console.log(`✂️ Created ${services.length} services`);

// //     // --- 3️⃣ Create Barbershop Locations ---
// //     const locationsData = [
// //       {
// //         name: "Elite Barber Studio - Downtown",
// //         address: "123 Main Street, City Center",
// //         latitude: 28.6139,
// //         longitude: 77.209,
// //         waitlist: 3,
// //         rating: 4.8,
// //         openHours: { open: "09:00", close: "21:00" },
// //         phone: "+91-9876543210",
// //         email: "downtown@elitebarber.com",
// //         services: services.map((s) => s._id),
// //         image: "https://via.placeholder.com/400x300?text=Elite+Downtown",
// //       },
// //       {
// //         name: "Classic Grooming - Sector 5",
// //         address: "789 Sector Road, Tech Park",
// //         latitude: 28.4595,
// //         longitude: 77.0266,
// //         waitlist: 2,
// //         rating: 4.7,
// //         openHours: { open: "08:00", close: "20:00" },
// //         phone: "+91-9876543212",
// //         email: "sector5@classicgroom.com",
// //         services: services.map((s) => s._id),
// //         image: "https://via.placeholder.com/400x300?text=Classic+Grooming",
// //       },
// //     ];

// //     const locations = await BarbershopLocation.insertMany(locationsData);
// //     console.log(`📍 Created ${locations.length} barbershop locations`);

// //     // --- 4️⃣ Create Customers ---
// //     const usersData = [
// //       {
// //         name: "Arjun Sharma",
// //         email: "arjun@customer.com",
// //         phone: "+91-9876543230",
// //         password: await bcrypt.hash("password123", 10),
// //         role: "customer",
// //         avatar: "https://via.placeholder.com/150x150?text=Arjun",
// //         isVerified: true,
// //         isActive: true,
// //       },
// //       {
// //         name: "Rohan Gupta",
// //         email: "rohan@customer.com",
// //         phone: "+91-9876543231",
// //         password: await bcrypt.hash("password123", 10),
// //         role: "customer",
// //         avatar: "https://via.placeholder.com/150x150?text=Rohan",
// //         isVerified: true,
// //         isActive: true,
// //       },
// //       {
// //         name: "Divya Mehta",
// //         email: "divya@customer.com",
// //         phone: "+91-9876543232",
// //         password: await bcrypt.hash("password123", 10),
// //         role: "customer",
// //         avatar: "https://via.placeholder.com/150x150?text=Divya",
// //         isVerified: true,
// //         isActive: true,
// //       },
// //     ];

// //     const users = await User.insertMany(usersData);
// //     console.log(`👤 Created ${users.length} customers`);

// //     // --- 5️⃣ Create Bookings ---
// //     const now = new Date();
// //     const bookingsData = [
// //       {
// //         userId: users[0]._id,
// //         barberId: barbers[0]._id,
// //         barbershopLocationId: locations[0]._id,
// //         serviceId: services[0]._id,
// //         appointmentDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
// //         appointmentTime: "10:00",
// //         duration: 30,
// //         status: "confirmed",
// //         totalPrice: 300,
// //         paymentStatus: "paid",
// //         notes: "Regular haircut with fade",
// //       },
// //       {
// //         userId: users[1]._id,
// //         barberId: barbers[1]._id,
// //         barbershopLocationId: locations[1]._id,
// //         serviceId: services[1]._id,
// //         appointmentDate: new Date(now.getTime() + 48 * 60 * 60 * 1000),
// //         appointmentTime: "14:30",
// //         duration: 20,
// //         status: "confirmed",
// //         totalPrice: 200,
// //         paymentStatus: "paid",
// //         notes: "Beard trim and shape",
// //       },
// //     ];

// //     const bookings = await Booking.insertMany(bookingsData);
// //     console.log(`📅 Created ${bookings.length} bookings`);

// //     // --- 6️⃣ Create Notifications ---
// //     const notificationsData = [
// //       {
// //         userId: users[0]._id,
// //         title: "Booking Confirmed",
// //         message: "Your appointment with Rajesh Kumar is confirmed",
// //         type: "booking_confirmation",
// //         relatedId: bookings[0]._id,
// //         isRead: false,
// //       },
// //       {
// //         userId: users[1]._id,
// //         title: "Appointment Reminder",
// //         message: "Your appointment is tomorrow",
// //         type: "appointment_reminder",
// //         relatedId: bookings[1]._id,
// //         isRead: false,
// //       },
// //     ];

// //     await Notification.insertMany(notificationsData);
// //     console.log(`🔔 Created ${notificationsData.length} notifications`);

// //     console.log("\n✅ Database seeded successfully!");
// //     console.log("👤 Customer: arjun@customer.com | password123");
// //     console.log("💈 Barber: rajesh@barber.com | password123");
// //     console.log("🔑 Add admin manually if required.");

// //     process.exit(0);
// //   } catch (error) {
// //     console.error("❌ Error seeding database:", error);
// //     process.exit(1);
// //   }
// // };

// // seedDatabase();
