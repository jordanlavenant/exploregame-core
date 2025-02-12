import { db } from 'api/src/lib/db'
import bcrypt from 'bcryptjs'

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

    const colorSets = [
      {
        id: '1',
        primary: '#8776b6',
        secondary: '#c1b8d9',
        tertiary: '#8776b6',
      },
      {
        id: '2',
        primary: '#00acc8',
        secondary: '#aae0e8',
        tertiary: '#00acc8',
      },
      {
        id: '3',
        primary: '#d87c27',
        secondary: '#f4c18f',
        tertiary: '#d87c27',
      },
      {
        id: '4',
        primary: '#d9a72b',
        secondary: '#f3db88',
        tertiary: '#d9a72b',
      },
      {
        id: '5',
        primary: '#afbf3c',
        secondary: '#dbdf9a',
        tertiary: '#afbf3c',
      },
      {
        id: '6',
        primary: '#e472ac',
        secondary: '#f6c0da',
        tertiary: '#e472ac',
      },
    ]
    await db.colorSet.createMany({ data: colorSets })

    const departments = [
      {
        id: '1',
        name: 'INFO',
        description: 'BUT Informatique',
        colorSetId: '1',
        latitude: 47.8433084,
        longitude: 1.9267556,
      },
      {
        id: '2',
        name: 'GEA',
        description: 'BUT Gestion des Entreprises et des Administrations',
        colorSetId: '2',
        latitude: 47.8437317,
        longitude: 1.9263861,
      },
      {
        id: '3',
        name: 'GMP',
        description: 'BUT Génie Mécanique et Productique',
        colorSetId: '3',
        latitude: 47.8440098,
        longitude: 1.9263063,
      },
      {
        id: '4',
        name: 'QLIO',
        description: 'BUT Qualité, Logistique Industrielle et Organisation',
        colorSetId: '4',
        latitude: 47.8441395,
        longitude: 1.927583,
      },
      {
        id: '5',
        name: 'Chimie',
        description: 'BUT Chimie',
        colorSetId: '6',
        latitude: 47.8439269,
        longitude: 1.927661,
      },
      {
        id: '6',
        name: 'MT2E',
        description:
          "BUT Métiers de la transition et de l'efficacité énergétiques",
        colorSetId: '5',
        latitude: 47.8435985,
        longitude: 1.9257699,
      },
    ]
    await db.department.createMany({ data: departments })

    const locations = [
      {
        id: '1',
        name: 'Batiment CAP',
        description: 'Batiment CAP',
      },
      {
        id: '2',
        name: 'Accueil',
        description: 'Accueil',
      },
      {
        id: '3',
        name: 'Bâtiment GEA',
        description: 'Bâtiment GEA',
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
    ]
    await db.step.createMany({ data: steps })

    const scriptsSteps = [
      {
        id: '1',
        scriptId: '1',
        stepId: '1',
        lettre: 'I',
      },
      {
        id: '2',
        scriptId: '1',
        stepId: '2',
        lettre: 'U',
      },
      {
        id: '3',
        scriptId: '1',
        stepId: '3',
        lettre: 'T',
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
    ]
    await db.questionType.createMany({ data: questionTypes })

    const questions = [
      // Lieu numéro 1 : Bâtiment CAP
      {
        id: '1',
        question: 'Dans quel bâtiment se trouve la cafétéria ?',
        description: '',
        questionTypeId: '2',
        stepId: '1',
      },
      {
        id: '2',
        question: 'Citez au moins un plat proposés à la cafétéria ?',
        description: '',
        questionTypeId: '1',
        stepId: '1',
      },
      {
        id: '3',
        question: 'Quelles sont les options de paiement disponibles ?',
        description: '',
        questionTypeId: '2',
        stepId: '1',
      },
      {
        id: '4',
        question: "Qu'est-ce que Izly ?",
        description: '',
        questionTypeId: '2',
        stepId: '1',
      },

      // Lieu numéro 2
      {
        id: '5',
        question:
          'Combien de radiateurs sont présents dans le hall géo-climatique ?',
        description: '',
        questionTypeId: '1',
        stepId: '2',
      },

      // Lieu numéro 3
      {
        id: '6',
        question: 'Où se trouve le secrétariat de mon département ?',
        description: '',
        questionTypeId: '2',
        stepId: '3',
      },
      {
        id: '7',
        question: 'Quel est le nom du secrétaire de mon département ?',
        description: '',
        questionTypeId: '1',
        stepId: '3',
      },
      {
        id: '8',
        question:
          "À qui dois-je m'adresser si je souhaite prévenir d'une absence ?",
        description: '',
        questionTypeId: '1',
        stepId: '3',
      },
      {
        id: '9',
        question: 'Combien existe-t-il de parcours dans mon département ?',
        description: "(s'aider d'internet si besoin)",
        questionTypeId: '1',
        stepId: '3',
      },
    ]
    await db.question.createMany({ data: questions })

    const answers = [
      {
        id: '1',
        answer: 'Bâtiment CAP',
        description: "C'est ici que se trouve la cafétéria.",
        questionId: '1',
        isCorrect: true,
      },
      {
        id: '2',
        answer: 'Bâtiment GEO',
        description: "Ce n'est pas le bon bâtiment.",
        questionId: '1',
        isCorrect: false,
      },
      {
        id: '3',
        answer: 'Bâtiment A',
        description: "Ce n'est pas le bon bâtiment.",
        questionId: '1',
        isCorrect: false,
      },
      {
        id: '4',
        answer: 'Bâtiment B',
        description: "Ce n'est pas le bon bâtiment.",
        questionId: '1',
        isCorrect: false,
      },
      {
        id: '5',
        answer: 'Carte bancaire et Izly',
        description: 'Modes de paiement acceptés.',
        questionId: '3',
        isCorrect: true,
      },
      {
        id: '6',
        answer: 'Espèces uniquement',
        description: "Ce n'est pas correct.",
        questionId: '3',
        isCorrect: false,
      },
      {
        id: '7',
        answer: 'Chèques seulement',
        description: "Ce n'est pas correct.",
        questionId: '3',
        isCorrect: false,
      },
      {
        id: '8',
        answer: 'Apple Pay uniquement',
        description: "Ce n'est pas correct.",
        questionId: '3',
        isCorrect: false,
      },
      {
        id: '9',
        answer: 'Un système de paiement étudiant',
        description: 'Izly est utilisé pour payer les repas et services.',
        questionId: '4',
        isCorrect: true,
      },
      {
        id: '10',
        answer: 'Une application de transport',
        description: "Ce n'est pas correct.",
        questionId: '4',
        isCorrect: false,
      },
      {
        id: '11',
        answer: 'Un service bancaire',
        description: "Ce n'est pas totalement exact.",
        questionId: '4',
        isCorrect: false,
      },
      {
        id: '12',
        answer: 'Un outil de gestion des emplois du temps',
        description: "Ce n'est pas correct.",
        questionId: '4',
        isCorrect: false,
      },
      {
        id: '13',
        answer: "Au secrétariat, près de l'accueil",
        description: 'Lieu où se trouve le secrétariat.',
        questionId: '6',
        isCorrect: true,
      },
      {
        id: '14',
        answer: 'Dans le bâtiment administratif',
        description: "Ce n'est pas correct.",
        questionId: '6',
        isCorrect: false,
      },
      {
        id: '15',
        answer: 'Dans la bibliothèque',
        description: "Ce n'est pas correct.",
        questionId: '6',
        isCorrect: false,
      },
      {
        id: '16',
        answer: 'Au premier étage',
        description: "Ce n'est pas correct.",
        questionId: '6',
        isCorrect: false,
      },

      // Réponses pour les questions de type 1 (texte)
      {
        id: '17',
        answer: 'Pâtes au pesto',
        description: 'Plat proposé à la cafétéria.',
        questionId: '2',
        isCorrect: true,
      },
      {
        id: '18',
        answer: '5',
        description: 'Il y a 5 radiateurs dans le hall géo-climatique.',
        questionId: '5',
        isCorrect: true,
      },
      {
        id: '19',
        answer: 'Monsieur Dupont',
        description: 'Nom du secrétaire du département.',
        questionId: '7',
        isCorrect: true,
      },
      {
        id: '20',
        answer: 'Madame Martin',
        description: "Personne à contacter en cas d'absence.",
        questionId: '8',
        isCorrect: true,
      },
      {
        id: '21',
        answer: '3 parcours',
        description: 'Nombre de parcours dans le département.',
        questionId: '9',
        isCorrect: true,
      },
    ]
    await db.answer.createMany({ data: answers })

    const hints = [
      {
        id: '1',
        help: 'Hint 1',
        questionId: '1',
        hintLevelId: '1',
      },
      {
        id: '2',
        help: 'Hint 2',
        questionId: '1',
        hintLevelId: '2',
      },
      {
        id: '3',
        help: 'Hint 3',
        questionId: '1',
        hintLevelId: '3',
      },
      {
        id: '4',
        help: 'Hint 4',
        questionId: '2',
        hintLevelId: '1',
      },
      {
        id: '5',
        help: 'Hint 5',
        questionId: '2',
        hintLevelId: '2',
      },
      {
        id: '6',
        help: 'Hint 6',
        questionId: '2',
        hintLevelId: '3',
      },
      {
        id: '7',
        help: 'Hint 7',
        questionId: '3',
        hintLevelId: '1',
      },
      {
        id: '8',
        help: 'Hint 8',
        questionId: '3',
        hintLevelId: '3',
      },
    ]

    await db.hint.createMany({ data: hints })

    const charactersData = [
      {
        nomPerso: 'Jérémie',
        descriptionL: "Jérémie est un futur étudiant de l'iut d'Orléans",
      },
      {
        nomPerso: 'Panda',
        descriptionL: "Panda est la mascotte officiel de l'Infasso",
      },
    ]
    const characters = []
    for (const characterData of charactersData) {
      const character = await db.character.create({ data: characterData })
      characters.push(character)
    }
    const characterSteps = [
      {
        characterId: characters[0].id,
        stepId: '1',
        text: "Bonjour, je m'appelle Jérémie, je suis un futur étudiant de l'iut d'Orléans",
      },
      {
        characterId: characters[1].id,
        stepId: '1',
        text: "Salut, je suis Panda, la mascotte officiel de l'Infasso",
      },
      {
        characterId: characters[0].id,
        stepId: '1',
        text: "Je suis là pour découvrir les différents départements de l'iut d'Orléans",
      },
      {
        characterId: characters[1].id,
        stepId: '1',
        text: "Je suis là pour t'aider à trouver les différentes étapes de ton aventure",
      },
      {
        characterId: characters[1].id,
        stepId: '1',
        text: 'Tu devras répondre aux questions avec les informations qui sont dans ce bâtiment.',
      },
      {
        characterId: characters[1].id,
        stepId: '1',
        text: 'Bonne chance ! :)',
      },
      {
        characterId: characters[0].id,
        stepId: '1',
        text: 'Merci Panda !',
      },
    ]
    await db.characterStep.createMany({ data: characterSteps })

    const players = [
      {
        email: 'joe@doe.com',
        password: 'joe',
        genderId: '1',
        firstname: 'Joe',
        lastname: 'Doe',
        departmentId: '1',
      },
      {
        email: 'jane@doe.com',
        password: 'jane',
        genderId: '2',
        firstname: 'Jane',
        lastname: 'Doe',
        departmentId: '2',
      },
      {
        email: 'john@doe.com',
        password: 'john',
        genderId: '1',
        firstname: 'John',
        lastname: 'Doe',
        departmentId: '3',
      },
    ]
    for (const player of players) {
      await db.player.create({
        data: {
          email: player.email,
          genderId: player.genderId,
          firstName: player.firstname,
          lastName: player.lastname,
          departmentId: player.departmentId,
          hashedPassword: await bcrypt.hash(player.password, 10),
        },
      })
    }

    console.info(
      `Seeded ${users.length} users, ${departments.length} departments, ${locations.length} locations, ${hintLevels.length} hintLevels, ${genders.length} genders, ${scripts.length} scripts, ${steps.length} steps, ${scriptsSteps.length} scriptsSteps, ${questionTypes.length} questionTypes, ${questions.length} questions, ${answers.length} answers, ${players.length} players, ${hints.length} hints`
    )
  } catch (error) {
    console.error(error)
  }
}
