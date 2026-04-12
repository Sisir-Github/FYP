import connectDb from './src/config/db.js'
import env from './src/config/env.js'
import User from './src/modules/users/user.model.js'
import Admin from './src/modules/users/admin.model.js'
import Region from './src/modules/regions/region.model.js'
import Trek from './src/modules/treks/trek.model.js'
import bcrypt from 'bcryptjs'

const seed = async () => {
  await connectDb()

  await Promise.all([
    User.deleteMany(),
    Admin.deleteMany(),
    Region.deleteMany(),
    Trek.deleteMany(),
  ])

  const hashedPassword = await bcrypt.hash('Admin@123', 10)
  const adminUser = await User.create({
    name: 'Everest Admin',
    email: 'admin@everest.com',
    password: hashedPassword,
    role: 'ADMIN',
  })
  await Admin.create({
    name: adminUser.name,
    email: adminUser.email,
    password: hashedPassword,
    role: 'ADMIN',
  })

  const regions = await Region.insertMany([
    {
      name: 'Everest',
      slug: 'everest',
      description: 'High alpine trails, glaciers, and Sherpa culture.',
    },
    {
      name: 'Annapurna',
      slug: 'annapurna',
      description: 'Diverse landscapes with iconic Himalayan vistas.',
    },
    {
      name: 'Langtang',
      slug: 'langtang',
      description: 'Quiet valleys and Tamang heritage villages.',
    },
  ])

  await Trek.insertMany([
    {
      name: 'Everest Base Camp',
      region: regions[0]._id,
      difficulty: 'Challenging',
      days: 14,
      price: 2200,
      description: 'Classic route to Everest Base Camp with acclimatization.',
      highlights: ['Namche Bazaar', 'Tengboche Monastery', 'Kala Patthar'],
    },
    {
      name: 'Annapurna Circuit',
      region: regions[1]._id,
      difficulty: 'Moderate',
      days: 16,
      price: 1900,
      description: 'Loop trek with Thorong La pass and cultural villages.',
      highlights: ['Manang', 'Thorong La', 'Muktinath'],
    },
  ])

  // eslint-disable-next-line no-console
  console.log('Seed data inserted')
  process.exit(0)
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})
