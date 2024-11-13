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
        email: 'root@root',
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

    const departments = [
      {
        id: '1',
        name: 'INFO',
        description: 'BUT Informatique',
      },
      {
        id: '2',
        name: 'GEA',
        description: 'BUT Gestion des Entreprises et des Administrations',
      },
      {
        id: '3',
        name: 'GMP',
        description: 'BUT Génie Mécanique et Productique',
      },
      {
        id: '4',
        name: 'QLIO',
        description: 'BUT Qualité, Logistique Industrielle et Organisation',
      },
      {
        id: '5',
        name: 'Chimie',
        description: 'BUT Chimie',
      },
      {
        id: '6',
        name: 'MT2E',
        description:
          "BUT Métiers de la transition et de l'efficacité énergétiques",
      },
    ]
    await db.department.createMany({ data: departments })

    const locations = [
      {
        id: '1',
        name: 'Belfort',
        description: 'Belfort',
      },
      {
        id: '2',
        name: 'Montbéliard',
        description: 'Montbéliard',
      },
      {
        id: '3',
        name: 'Sevenans',
        description: 'Sevenans',
      },
    ]
    await db.location.createMany({ data: locations })

    const hintLevels = [
      {
        id: '1',
        type: 'Petit',
      },
      {
        id: '2',
        type: 'Normal',
      },
      {
        id: '3',
        type: 'Grand',
      },
    ]
    await db.hintLevel.createMany({ data: hintLevels })

    const genders = [
      {
        id: '1',
        gender: 'Homme',
      },
      {
        id: '2',
        gender: 'Femme',
      },
      {
        id: '3',
        gender: 'Autre',
      },
    ]
    await db.gender.createMany({ data: genders })

    const scripts = [
      {
        id: '1',
        name: 'Script 1',
        visible: true,
        departmentId: '1',
      },
      {
        id: '2',
        name: 'Script 2',
        visible: true,
        departmentId: '2',
      },
      {
        id: '3',
        name: 'Script 3',
        visible: true,
        departmentId: '3',
      },
    ]
    await db.script.createMany({ data: scripts })

    const steps = [
      {
        id: '1',
        name: 'Step 1',
        locationId: '1',
      },
      {
        id: '2',
        name: 'Step 2',
        locationId: '2',
      },
      {
        id: '3',
        name: 'Step 3',
        locationId: '3',
      },
      {
        id: '4',
        name: 'Step 4',
        locationId: '1',
      },
      {
        id: '5',
        name: 'Step 5',
        locationId: '2',
      },
      {
        id: '6',
        name: 'Step 6',
        locationId: '3',
      },
      {
        id: '7',
        name: 'Step 7',
        locationId: '1',
      },
      {
        id: '8',
        name: 'Step 8',
        locationId: '2',
      },
      {
        id: '9',
        name: 'Step 9',
        locationId: '3',
      },
      {
        id: '10',
        name: 'Step 10',
        locationId: '1',
      },
    ]
    await db.step.createMany({ data: steps })

    const scriptsSteps = [
      {
        id: '1',
        scriptId: '1',
        stepId: '1',
        lettre: 'A',
      },
      {
        id: '2',
        scriptId: '1',
        stepId: '2',
        lettre: 'R',
      },
      {
        id: '3',
        scriptId: '1',
        stepId: '3',
        lettre: 'K',
      },
      {
        id: '4',
        scriptId: '2',
        stepId: '4',
        lettre: 'H',
      },
      {
        id: '5',
        scriptId: '2',
        stepId: '5',
        lettre: 'T',
      },
      {
        id: '6',
        scriptId: '2',
        stepId: '6',
        lettre: 'S',
      },
      {
        id: '7',
        scriptId: '3',
        stepId: '7',
        lettre: 'N',
      },
      {
        id: '8',
        scriptId: '3',
        stepId: '8',
        lettre: 'N',
      },
      {
        id: '9',
        scriptId: '3',
        stepId: '9',
        lettre: 'C',
      },
    ]
    await db.scriptStep.createMany({ data: scriptsSteps })

    const questionTypes = [
      {
        id: '1',
        type: 'Texte',
      },
      {
        id: '2',
        type: 'Choix',
      },
      {
        id: '3',
        type: 'Date',
      },
    ]
    await db.questionType.createMany({ data: questionTypes })

    const questions = [
      {
        id: '1',
        question: "Quel est votre nom ?",
        description: "Entrez votre nom",
        questionTypeId: '1',
        stepId: '1',
      },
      {
        id: '2',
        question: "Quel est votre prénom ?",
        description: "Entrez votre prénom",
        questionTypeId: '1',
        stepId: '2',
      },
      {
        id: '3',
        question: "Quel est votre âge ?",
        description: "Entrez votre âge",
        questionTypeId: '1',
        stepId: '3',
      },
      {
        id: '4',
        question: "Quel est votre sexe ?",
        description: "Entrez votre sexe",
        questionTypeId: '2',
        stepId: '4',
      },
      {
        id: '5',
        question: "Quel est votre date de naissance ?",
        description: "Entrez votre date de naissance",
        questionTypeId: '3',
        stepId: '5',
      },
      {
        id: '6',
        question: "Quel est votre adresse ?",
        description: "Entrez votre adresse",
        questionTypeId: '1',
        stepId: '6',
      },
      {
        id: '7',
        question: "Quel est votre code postal ?",
        description: "Entrez votre code postal",
        questionTypeId: '1',
        stepId: '7',
      },
      {
        id: '8',
        question: "Quel est votre ville ?",
        description: "Entrez votre ville",
        questionTypeId: '1',
        stepId: '8',
      },
      {
        id: '9',
        question: "Quel est votre numéro de téléphone ?",
        description: "Entrez votre numéro de téléphone",
        questionTypeId: '1',
        stepId: '9',
      },
      {
        id: '10',
        question: "Quel est votre email ?",
        description: "Entrez votre email",
        questionTypeId: '1',
        stepId: '10',
      }
    ]
    await db.question.createMany({ data: questions })

    const answers = [
      {
        id: '1',
        answer: 'Joe',
        description: 'Joe Mama',
        questionId: '1',
      },
      {
        id: '2',
        answer: 'Mama',
        description: 'Joe Mama',
        questionId: '2',
      },
      {
        id: '3',
        answer: '69',
        description: 'Joe Mama',
        questionId: '3',
      },
      {
        id: '4',
        answer: 'Homme',
        description: 'Joe Mama',
        questionId: '4',
      },
      {
        id: '5',
        answer: '01/01/1970',
        description: 'Joe Mama',
        questionId: '5',
      },
      {
        id: '6',
        answer: '1 rue de la rue',
        description: 'Joe Mama',
        questionId: '6',
      },
      {
        id: '7',
        answer: '90000',
        description: 'Joe Mama',
        questionId: '7',
      },
      {
        id: '8',
        answer: 'Belfort',
        description: 'Joe Mama',
        questionId: '8',
      },
      {
        id: '9',
        answer: '0123456789',
        description: 'Joe Mama',
        questionId: '9',
      },
      {
        id: '10',
        answer: 'joe@gmail.com',
        description: 'Joe Mama',
        questionId: '10',
      },
    ]
    await db.answer.createMany({ data: answers })

    console.info(
      `Seeded ${users.length} users, ${departments.length} departments, ${locations.length} locations, ${hintLevels.length} hintLevels, ${genders.length} genders`
    )
  } catch (error) {
    console.error(error)
  }
}
