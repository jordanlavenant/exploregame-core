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
        order: 0,
      },
      {
        id: '2',
        scriptId: '1',
        stepId: '2',
        lettre: 'U',
        order: 1,
      },
      {
        id: '3',
        scriptId: '1',
        stepId: '3',
        lettre: 'T',
        order: 2,
      },
    ]
    await db.scriptStep.createMany({ data: scriptsSteps })

    const questionTypes = [
      {
        id: '1',
        type: 'Réponse texte',
      },
      {
        id: '2',
        type: 'Choix unique',
      },
      {
        id: '3',
        type: 'Choix multiple',
      },
    ]
    await db.questionType.createMany({ data: questionTypes })

    const questions = [
      {
        id: '1',
        question: 'Dans quel bâtiment se trouve la cafétéria ?',
        description: '',
        questionTypeId: '2',
        stepId: '1',
        order: 0,
      },
      {
        id: '2',
        question: 'Citez au moins 2 plats proposés à la cafétéria ?',
        description: '',
        questionTypeId: '3',
        stepId: '1',
        order: 1,
      },
      {
        id: '3',
        question: 'Quelles sont les options de paiement disponibles ?',
        description: '',
        questionTypeId: '2',
        stepId: '1',
        order: 2,
      },
      {
        id: '4',
        question: "Qu'est-ce que Izly ?",
        description: '',
        questionTypeId: '2',
        stepId: '1',
        order: 3,
      },

      // Lieu numéro 2
      {
        id: '5',
        question:
          'Combien de radiateurs sont présents dans le hall géo-climatique ?',
        description: '',
        questionTypeId: '1',
        stepId: '2',
        order: 0,
      },

      // Lieu numéro 3
      {
        id: '6',
        question: 'Où se trouve le secrétariat de mon département ?',
        description: '',
        questionTypeId: '2',
        stepId: '3',
        order: 0,
      },
      {
        id: '7',
        question: 'Quel est le nom du secrétaire de mon département ?',
        description: '',
        questionTypeId: '1',
        stepId: '3',
        order: 1,
      },
      {
        id: '8',
        question:
          "À qui dois-je m'adresser si je souhaite prévenir d'une absence ?",
        description: '',
        questionTypeId: '1',
        stepId: '3',
        order: 2,
      },
      {
        id: '9',
        question: 'Combien existe-t-il de parcours dans mon département ?',
        description: "(s'aider d'internet si besoin)",
        questionTypeId: '1',
        stepId: '3',
        order: 3,
      },
    ]
    await db.question.createMany({ data: questions })

    const answers = [
      {
        id: 'a79ad75b-e163-47e5-b2ad-70cf25243404',
        answer: 'Bâtiment CAP',
        description: "C'est ici que se trouve la cafétéria.",
        questionId: '1',
        isCorrect: true,
      },
      {
        id: 'bb716ca7-59a3-43f1-9455-570259d38a50',
        answer: 'Bâtiment GEO',
        description: "Ce n'est pas le bon bâtiment.",
        questionId: '1',
        isCorrect: false,
      },
      {
        id: 'c2e264ba-f39d-4840-97a5-7824d7445b72',
        answer: 'Bâtiment A',
        description: "Ce n'est pas le bon bâtiment.",
        questionId: '1',
        isCorrect: false,
      },
      {
        id: 'cfe2d8a8-664d-405e-9896-25de45966f76',
        answer: 'Bâtiment B',
        description: "Ce n'est pas le bon bâtiment.",
        questionId: '1',
        isCorrect: false,
      },
      {
        id: '850d5dec-cc21-48c4-9fff-c2b44ef09324',
        answer: 'Pizza',
        description: '',
        questionId: '2',
        isCorrect: false,
      },
      {
        id: '90195fc0-c772-46bd-8b8f-de06478015d3',
        answer: 'Panini',
        description: "",
        questionId: '2',
        isCorrect: true,
      },
      {
        id: '113ad65f-dba5-4f6f-ab44-89d20f26ebbc',
        answer: 'Gaufre',
        description: "",
        questionId: '2',
        isCorrect: true,
      },
      {
        id: '6ae54b6a-6447-4be6-8bac-56b7099903ca',
        answer: 'Boeuf de Kobe',
        description: "",
        questionId: '2',
        isCorrect: false,
      },
      {
        id: '7d93a4b4-47b8-4283-bad9-818b719292d3',
        answer: 'Carte bancaire et Izly',
        description: 'Modes de paiement acceptés.',
        questionId: '3',
        isCorrect: true,
      },
      {
        id: '45b879f4-6297-4f82-9ce2-e61d82f6af15',
        answer: 'Espèces uniquement',
        description: "Ce n'est pas correct.",
        questionId: '3',
        isCorrect: false,
      },
      {
        id: '053f1db4-7f34-4026-b98d-cc526b55a22a',
        answer: 'Chèques seulement',
        description: "Ce n'est pas correct.",
        questionId: '3',
        isCorrect: false,
      },
      {
        id: 'b4ea19ad-02bd-42e8-9dbd-2f582d75cfeb',
        answer: 'Apple Pay uniquement',
        description: "Ce n'est pas correct.",
        questionId: '3',
        isCorrect: false,
      },
      {
        id: '96cc9332-93f3-42e4-b40b-6aa351cd40eb',
        answer: 'Un système de paiement étudiant',
        description: 'Izly est utilisé pour payer les repas et services.',
        questionId: '4',
        isCorrect: true,
      },
      {
        id: '5fc61e33-1006-4811-b4dd-145177dfde88',
        answer: 'Une application de transport',
        description: "Ce n'est pas correct.",
        questionId: '4',
        isCorrect: false,
      },
      {
        id: '8726f4c6-a5b0-4434-b45b-9aaba13a6b26',
        answer: 'Un service bancaire',
        description: "Ce n'est pas totalement exact.",
        questionId: '4',
        isCorrect: false,
      },
      {
        id: '25b8e739-0322-4801-a03e-2815f426faa3',
        answer: 'Un outil de gestion des emplois du temps',
        description: "Ce n'est pas correct.",
        questionId: '4',
        isCorrect: false,
      },
      {
        id: 'f2c447de-a906-4ed1-854b-13aefb355f8e',
        answer: "Au secrétariat, près de l'accueil",
        description: 'Lieu où se trouve le secrétariat.',
        questionId: '6',
        isCorrect: true,
      },
      {
        id: 'fd57662a-51a7-48c6-8dcb-12f2bc489e92',
        answer: 'Dans le bâtiment administratif',
        description: "Ce n'est pas correct.",
        questionId: '6',
        isCorrect: false,
      },
      {
        id: '318af6fb-1a59-4536-867c-78c7b600c23c',
        answer: 'Dans la bibliothèque',
        description: "Ce n'est pas correct.",
        questionId: '6',
        isCorrect: false,
      },
      {
        id: '8ec7ba29-9685-40e0-a69d-fe65a2be31c8',
        answer: 'Au premier étage',
        description: "Ce n'est pas correct.",
        questionId: '6',
        isCorrect: false,
      },
      {
        id: '3bb7d9e5-5a69-4af3-811d-aa881269e384',
        answer: '5',
        description: 'Il y a 5 radiateurs dans le hall géo-climatique.',
        questionId: '5',
        isCorrect: true,
      },
      {
        id: '2a8adbd5-a19d-494f-8c38-ec0e913f1a7a',
        answer: 'Monsieur Dupont',
        description: 'Nom du secrétaire du département.',
        questionId: '7',
        isCorrect: true,
      },
      {
        id: '0b87ad52-6247-4db0-9960-566ea9ab7b41',
        answer: 'Madame Martin',
        description: "Personne à contacter en cas d'absence.",
        questionId: '8',
        isCorrect: true,
      },
      {
        id: 'dd2144b2-17ad-40ff-ae51-bcf81502b1af',
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
        username: 'jordanlavenant',
        password: 'jordan',
        departmentId: '1',
      },
      {
        username: 'danielmalleron',
        password: 'daniel',
        departmentId: '2',
      },
      {
        username: 'leolucidor',
        password: 'leo',
        departmentId: '2',
      },
      {
        username: 'nathanpigoreau',
        password: 'nathan',
        departmentId: '2',
      },
    ]
    for (const player of players) {
      await db.player.create({
        data: {
          username: player.username,
          departmentId: player.departmentId,
          hashedPassword: await bcrypt.hash(player.password, 10),
        },
      })
    }

    console.info(
      `Seeded ${users.length} users, ${departments.length} departments, ${locations.length} locations, ${hintLevels.length} hintLevels, ${scripts.length} scripts, ${steps.length} steps, ${scriptsSteps.length} scriptsSteps, ${questionTypes.length} questionTypes, ${questions.length} questions, ${answers.length} answers, ${players.length} players, ${hints.length} hints`
    )
  } catch (error) {
    console.error(error)
  }
}
