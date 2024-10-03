import { db } from 'api/src/lib/db'

export default async () => {
  try {
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
    await db.course.createMany({ data: courses })

    // Rest ...

    console.info(
      '\n  No seed data, skipping. See scripts/seed.ts to start seeding your database!\n'
    )
  } catch (error) {
    console.error(error)
  }
}
