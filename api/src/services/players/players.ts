import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type {
  QueryResolvers,
  MutationResolvers,
  PlayerRelationResolvers,
} from 'types/graphql'

import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { uploadFile } from 'src/lib/minio'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const PLAYER_PROFILE_PICTURE_BUCKET = process.env.REDWOOD_ENV_PLAYER_PROFILE_PICTURE_BUCKET

export const players: QueryResolvers['players'] = () => {
  return db.player.findMany()
}

export const player: QueryResolvers['player'] = ({ id }) => {
  return db.player.findUnique({
    where: { id },
  })
}

export const createPlayer: MutationResolvers['createPlayer'] = ({ input }) => {
  return db.player.create({
    data: input,
  })
}

export const updatePlayer: MutationResolvers['updatePlayer'] = ({
  id,
  input,
}) => {
  return db.player.update({
    data: input,
    where: { id },
  })
}

export const deletePlayer: MutationResolvers['deletePlayer'] = ({ id }) => {
  return db.player.delete({
    where: { id },
  })
}

export const Player: PlayerRelationResolvers = {
  Gender: (_obj, { root }) => {
    return db.player.findUnique({ where: { id: root?.id } }).Gender()
  },
  Department: (_obj, { root }) => {
    return db.player.findUnique({ where: { id: root?.id } }).Department()
  },
  PlayerScript: (_obj, { root }) => {
    return db.player.findUnique({ where: { id: root?.id } }).PlayerScript()
  },
}

export const loginPlayer: MutationResolvers['loginPlayer'] = async ({
  input,
}) => {
  const { email, password } = input

  const player = await db.player.findUnique({ where: { email } })

  if (!player) {
    throw new AuthenticationError(`L'email est incorrect ${email}`)
  }

  // Comparaison du mot de passe haché
  const isPasswordValid = await bcrypt.compare(password, player.hashedPassword)

  if (!isPasswordValid) {
    throw new AuthenticationError(
      `Mot de passe incorrect pour la tentaive de connexion avec l'email: ${email}`
    )
  }

  console.log(`🟢 L'utilisateur ${player.email} s'est connecté avec succès`)

  // Génération d'un token JWT
  const token = jwt.sign({ userId: player.id }, JWT_SECRET_KEY, {
    expiresIn: '1h',
  })

  return {
    token,
    player,
  }
}
