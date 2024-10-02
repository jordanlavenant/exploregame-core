import { db } from 'api/src/lib/db'

export default async () => {
  try {
    const filieres = [
      {
        nomF: 'INFO',
        descriptionF: 'BUT Informatique',
      },
      {
        nomF: 'GEA',
        descriptionF: 'BUT Gestion des Entreprises et des Administrations',
      },
      {
        nomF: 'GMP',
        descriptionF: 'BUT Génie Mécanique et Productique',
      },
      {
        nomF: 'QLIO',
        descriptionF: 'BUT Qualité, Logistique Industrielle et Organisation',
      },
      {
        nomF: 'Chimie',
        descriptionF: 'BUT Chimie',
      },
      {
        nomF: 'MT2E',
        descriptionF:
          "BUT Métiers de la transition et de l'efficacité énergétiques",
      },
    ]
    await db.filiere.createMany({ data: filieres })

    // Rest ...

    console.info(
      '\n  No seed data, skipping. See scripts/seed.ts to start seeding your database!\n'
    )
  } catch (error) {
    console.error(error)
  }
}
