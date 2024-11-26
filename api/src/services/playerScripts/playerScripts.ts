import type {
  QueryResolvers,
  MutationResolvers,
  PlayerScriptRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const playerScripts: QueryResolvers['playerScripts'] = () => {
  return db.playerScript.findMany()
}

export const playerScript: QueryResolvers['playerScript'] = ({ id }) => {
  return db.playerScript.findUnique({
    where: { id },
  })
}

export const createPlayerScript: MutationResolvers['createPlayerScript'] = ({
  input,
}) => {
  return db.playerScript.create({
    data: input,
  })
}

export const updatePlayerScript: MutationResolvers['updatePlayerScript'] = ({
  id,
  input,
}) => {
  return db.playerScript.update({
    data: input,
    where: { id },
  })
}

export const deletePlayerScript: MutationResolvers['deletePlayerScript'] = ({
  id,
}) => {
  return db.playerScript.delete({
    where: { id },
  })
}

export const PlayerScript: PlayerScriptRelationResolvers = {
  Player: (_obj, { root }) => {
    return db.playerScript.findUnique({ where: { id: root?.id } }).Player()
  },
  Script: (_obj, { root }) => {
    return db.playerScript.findUnique({ where: { id: root?.id } }).Script()
  },
  Step: (_obj, { root }) => {
    return db.playerScript.findUnique({ where: { id: root?.id } }).Step()
  },
  Question: (_obj, { root }) => {
    return db.playerScript.findUnique({ where: { id: root?.id } }).Question()
  },
}
