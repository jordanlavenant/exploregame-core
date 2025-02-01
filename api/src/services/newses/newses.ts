import type {
  QueryResolvers,
  MutationResolvers,
  NewsRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const newses: QueryResolvers['newses'] = () => {
  return db.news.findMany()
}

export const news: QueryResolvers['news'] = ({ id }) => {
  return db.news.findUnique({
    where: { id },
  })
}

export const createNews: MutationResolvers['createNews'] = ({ input }) => {
  return db.news.create({
    data: input,
  })
}

export const updateNews: MutationResolvers['updateNews'] = ({ id, input }) => {
  return db.news.update({
    data: input,
    where: { id },
  })
}

export const deleteNews: MutationResolvers['deleteNews'] = ({ id }) => {
  return db.news.delete({
    where: { id },
  })
}

export const News: NewsRelationResolvers = {
  tags: (_obj, { root }) => {
    return db.news.findUnique({ where: { id: root?.id } }).tags()
  },
}
