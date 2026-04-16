require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Trek = require('./models/Trek');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Payment = require('./models/Payment');
const Notification = require('./models/Notification');
const dbConfig = require('./config/db');

const seedData = async () => {
  await dbConfig();
  console.log('🚀 Initiating massive database seeding phase...');

  try {
    // 1. Wipe current collections to prevent dupes during seeding testing
    await User.deleteMany({});
    await Trek.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});

    console.log('🧹 Purged existing collections');

    // 2. Generate Admin + Users
    const usersData = [
      { name: 'System Admin', email: 'admin@everest.com', password: 'Password123!', role: 'admin', isVerified: true },
      { name: 'John Doe', email: 'john@example.com', password: 'Password123!', role: 'user', isVerified: true },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'Password123!', role: 'user', isVerified: true },
      { name: 'Mike Ross', email: 'mike@example.com', password: 'Password123!', role: 'user', isVerified: false },
      { name: 'Sarah Trekker', email: 'sarah@example.com', password: 'Password123!', role: 'user', isVerified: true },
      { name: 'David Unverified', email: 'david@example.com', password: 'Password123!', role: 'user', isVerified: false },
    ];

    const users = await User.create(usersData);
    const admin = users[0];
    const normalUsers = users.slice(1);
    console.log('👤 Seeded 6 Users (1 Admin, 5 Standard)');

    // 3. Generate Treks (8-12 Realistic Packages)
    const treksData = [
      {
        title: 'Everest Base Camp Trek',
        duration: 14,
        maxAltitude: 5364,
        difficulty: 'Strenuous',
        price: 1450,
        startPoint: 'Lukla',
        endPoint: 'Kala Patthar',
        bestSeasons: ['Spring', 'Autumn'],
        description: 'The classic journey to the base of the world’s highest peak. Experience Sherpa culture and stunning Himalayan vistas.',
        accommodations: ['Teahouses', 'Lodges'],
        meals: ['Breakfast', 'Dinner'],
        included: ['Permits', 'Guide', 'Flights to Lukla'],
        excluded: ['Insurance', 'Personal Gear'],
        itinerary: [{ day: 1, title: 'Arrival in Kathmandu', description: 'Welcome to Nepal.' }],
        images: [{ public_id: 'mock1', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa' }],
        isFeatured: true
      },
      {
        title: 'Annapurna Base Camp Trek',
        duration: 10,
        maxAltitude: 4130,
        difficulty: 'Challenging',
        price: 950,
        startPoint: 'Nayapul',
        endPoint: 'ABC',
        bestSeasons: ['Spring', 'Autumn'],
        description: 'A spectacular journey straight into the heart of the Annapurna range.',
        accommodations: ['Teahouses'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        included: ['Permits', 'Guide', 'Transportation'],
        excluded: ['Insurance', 'Tips'],
        itinerary: [{ day: 1, title: 'Drive to Pokhara', description: 'Scenic drive.' }],
        images: [{ public_id: 'mock2', url: 'https://images.unsplash.com/photo-1585421590483-365261d7bbf1' }],
        isFeatured: true
      },
      {
        title: 'Manaslu Circuit Trek',
        duration: 16,
        maxAltitude: 5106,
        difficulty: 'Strenuous',
        price: 1250,
        startPoint: 'Soti Khola',
        endPoint: 'Besi Sahar',
        bestSeasons: ['Spring', 'Autumn'],
        description: 'A less crowded alternative to the Annapurna Circuit, featuring diverse landscapes and rich culture.',
        accommodations: ['Teahouses'],
        meals: ['Breakfast', 'Dinner'],
        included: ['Restricted Area Permits', 'Guide'],
        excluded: ['Insurance'],
        itinerary: [{ day: 1, title: 'Drive to Soti Khola', description: 'Start the adventure.' }],
        images: [{ public_id: 'mock3', url: 'https://images.unsplash.com/photo-1627885437175-65fb5eb5527a' }],
        isFeatured: false
      },
      {
        title: 'Ghorepani Poon Hill Trek',
        duration: 5,
        maxAltitude: 3210,
        difficulty: 'Easy',
        price: 450,
        startPoint: 'Nayapul',
        endPoint: 'Poon Hill',
        bestSeasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
        description: 'Short and accessible trek offering panoramic views of the Annapurna and Dhaulagiri ranges.',
        accommodations: ['Teahouses'],
        meals: ['Breakfast'],
        included: ['Guide', 'Permits'],
        excluded: ['Lunch', 'Dinner'],
        itinerary: [{ day: 1, title: 'Nayapul to Tikhedhunga', description: 'Ascent' }],
        images: [{ public_id: 'mock4', url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc' }],
        isFeatured: true
      },
      {
        title: 'Upper Mustang Trek',
        duration: 15,
        maxAltitude: 3840,
        difficulty: 'Challenging',
        price: 1800,
        startPoint: 'Jomsom',
        endPoint: 'Lo Manthang',
        bestSeasons: ['Spring', 'Summer', 'Autumn'],
        description: 'Explore the hidden kingdom of Lo with its unique Tibetan culture and arid landscapes.',
        accommodations: ['Teahouses'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        included: ['Restricted Area Permit', 'Flights Jomsom'],
        excluded: ['Insurance'],
        itinerary: [{ day: 1, title: 'Fly to Jomsom', description: 'Start.' }],
        images: [{ public_id: 'mock5', url: 'https://images.unsplash.com/photo-1510103289069-7ee429d2f2ca' }],
        isFeatured: false
      },
      {
        title: 'Gokyo Lakes Trek',
        duration: 13,
        maxAltitude: 5357,
        difficulty: 'Strenuous',
        price: 1350,
        startPoint: 'Lukla',
        endPoint: 'Gokyo Ri',
        bestSeasons: ['Spring', 'Autumn'],
        description: 'Alternative to EBC, exploring the serene turquoise lakes of the Gokyo valley.',
        accommodations: ['Teahouses'],
        meals: ['Breakfast', 'Dinner'],
        included: ['Permits', 'Guide'],
        excluded: ['Flights'],
        itinerary: [{ day: 1, title: 'Fly to Lukla', description: 'Start.' }],
        images: [{ public_id: 'mock6', url: 'https://images.unsplash.com/photo-1516246849495-a131afef59e4' }],
        isFeatured: true
      },
      {
        title: 'Langtang Valley Trek',
        duration: 8,
        maxAltitude: 4984,
        difficulty: 'Moderate',
        price: 650,
        startPoint: 'Syabrubesi',
        endPoint: 'Kyanjin Gompa',
        bestSeasons: ['Spring', 'Autumn'],
        description: 'The valley of glaciers. Close to Kathmandu with stunning mountain views.',
        accommodations: ['Teahouses'],
        meals: ['Breakfast', 'Dinner'],
        included: ['Permits', 'Guide'],
        excluded: ['Transportation'],
        itinerary: [{ day: 1, title: 'Drive to Syabrubesi', description: 'Start.' }],
        images: [{ public_id: 'mock7', url: 'https://images.unsplash.com/photo-1544735716-e578fa25c15e' }],
        isFeatured: false
      },
      {
        title: 'Mardi Himal Trek',
        duration: 6,
        maxAltitude: 4500,
        difficulty: 'Moderate',
        price: 550,
        startPoint: 'Kande',
        endPoint: 'Mardi Base Camp',
        bestSeasons: ['Spring', 'Autumn'],
        description: 'A newly opened pristine trail offering grand views of Machhapuchhre (Fishtail).',
        accommodations: ['Teahouses'],
        meals: ['Breakfast'],
        included: ['Permits', 'Guide'],
        excluded: ['Lunch'],
        itinerary: [{ day: 1, title: 'Kande to Australian Camp', description: 'Start.' }],
        images: [{ public_id: 'mock8', url: 'https://images.unsplash.com/photo-1580211105400-366a7b7352f1' }],
        isFeatured: false
      }
    ];

    const treks = await Trek.create(treksData);
    console.log('⛰️ Seeded 8 Trek Packages');

    // 4. Generate Bookings & Payments
    const bookingsData = [
      {
        user: normalUsers[0]._id, // John
        trek: treks[0]._id, // EBC
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
        participants: 2,
        totalAmount: treks[0].price * 2,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: 'Khalti',
        paymentId: 'pidx_A001_mock',
      },
      {
        user: normalUsers[1]._id, // Jane
        trek: treks[1]._id, // ABC
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago (Completed)
        participants: 1,
        totalAmount: treks[1].price,
        status: 'Completed',
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        paymentId: 'TXN_BANK_001',
      },
      {
        user: normalUsers[3]._id, // Sarah
        trek: treks[3]._id, // Poon Hill
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), 
        participants: 4,
        totalAmount: treks[3].price * 4,
        status: 'Pending',
        paymentStatus: 'Unpaid',
        paymentMethod: 'Khalti',
      },
      {
        user: normalUsers[0]._id, // John
        trek: treks[6]._id, // Langtang
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), 
        participants: 1,
        totalAmount: treks[6].price,
        status: 'Cancelled',
        paymentStatus: 'Refunded',
        paymentMethod: 'Khalti',
        paymentId: 'pidx_A002_mock'
      }
    ];

    const bookings = await Booking.create(bookingsData);
    console.log('🎫 Seeded 4 Bookings');

    // Payments mapped to Bookings
    await Payment.create([
      {
        booking: bookings[0]._id,
        user: normalUsers[0]._id,
        pidx: 'pidx_A001_mock',
        transactionId: 'KHALTI_TXN_001',
        amount: bookings[0].totalAmount,
        paymentMethod: 'Khalti',
        status: 'Completed'
      },
      {
        booking: bookings[1]._id,
        user: normalUsers[1]._id,
        transactionId: 'TXN_BANK_001',
        amount: bookings[1].totalAmount,
        paymentMethod: 'Bank Transfer',
        status: 'Completed'
      },
      {
        booking: bookings[3]._id,
        user: normalUsers[0]._id,
        pidx: 'pidx_A002_mock',
        amount: bookings[3].totalAmount,
        paymentMethod: 'Khalti',
        status: 'Refunded'
      }
    ]);
    console.log('💵 Seeded Payment Records');

    // 5. Generate Reviews
    await Review.create([
      {
        trek: treks[1]._id, // ABC
        user: normalUsers[1]._id, // Jane (who completed ABC)
        rating: 5,
        title: 'Amazing Experience!',
        text: 'The Annapurna range was extremely beautiful, guides were so helpful.',
      },
      {
        trek: treks[0]._id, // EBC (Mocking past review)
        user: normalUsers[3]._id, // Sarah
        rating: 4,
        title: 'Hard but worth it',
        text: 'Altitude hit me hard, but the view of Everest was breathtaking.',
      }
    ]);
    console.log('⭐ Seeded Reviews');

    // 6. Generate Notifications
    await Notification.create([
      {
        user: normalUsers[0]._id,
        title: 'Booking Confirmed',
        message: 'Your booking for Everest Base Camp Trek has been confirmed.',
        type: 'Booking',
        isRead: false
      },
      {
        user: normalUsers[0]._id,
        title: 'Payment Successful',
        message: `We received your payment of $${bookings[0].totalAmount}.`,
        type: 'Payment',
        isRead: true
      }
    ]);
    console.log('🔔 Seeded Notifications');

    console.log('🎉 DB SEEDING COMPLETED SUCCESSFULLY!');
    process.exit();
  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    process.exit(1);
  }
};

seedData();
