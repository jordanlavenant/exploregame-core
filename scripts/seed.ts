import { db } from 'api/src/lib/db'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

export default async () => {
  try {
    const users = [
      {
        email: 'admin@admin',
        password: 'admin',
      },
      {
        email: ' root@root',
        password: 'root',
      },
    ]

    for (const user of users) {
      const [hashedPassword, salt] = await hashPassword(user.password)
      await db.user.create({
        data: {
          email: user.email,
          hashedPassword,
          salt,
        },
      })
    }

    const courses = [
      {
        name: 'INFO',
        description: 'BUT Informatique',
      },
      {
        name: 'GEA',
        description: 'BUT Gestion des Entreprises et des Administrations',
      },
      {
        name: 'GMP',
        description: 'BUT Génie Mécanique et Productique',
      },
      {
        name: 'QLIO',
        description: 'BUT Qualité, Logistique Industrielle et Organisation',
      },
      {
        name: 'Chimie',
        description: 'BUT Chimie',
      },
      {
        name: 'MT2E',
        description:
          "BUT Métiers de la transition et de l'efficacité énergétiques",
      },
    ]
    await db.department.createMany({ data: courses })

    // Rest ...

    console.info(
      '\n  No seed data, skipping. See scripts/seed.ts to start seeding your database!\n'
    )
  } catch (error) {
    console.error(error)
  }
}
