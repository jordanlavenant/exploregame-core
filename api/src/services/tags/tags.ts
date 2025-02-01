import type {
  QueryResolvers,
  MutationResolvers,
  TagRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const tags: QueryResolvers['tags'] = () => {
  return db.tag.findMany()
}

export const tag: QueryResolvers['tag'] = ({ id }) => {
  return db.tag.findUnique({
    where: { id },
  })
}

export const createTag: MutationResolvers['createTag'] = ({ input }) => {
  return db.tag.create({
    data: input,
  })
}

export const updateTag: MutationResolvers['updateTag'] = ({ id, input }) => {
  return db.tag.update({
    data: input,
    where: { id },
  })
}

export const deleteTag: MutationResolvers['deleteTag'] = ({ id }) => {
  return db.tag.delete({
    where: { id },
  })
}

export const Tag: TagRelationResolvers = {
  news: (_obj, { root }) => {
    return db.tag.findUnique({ where: { id: root?.id } }).news()
  },
}
