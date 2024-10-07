import type {
  QueryResolvers,
  MutationResolvers,
  PlayerRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

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
