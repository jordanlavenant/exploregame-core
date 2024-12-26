import type {
  QueryResolvers,
  MutationResolvers,
  AssetRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { getUploadUrl, getUrl } from 'src/lib/minio'

export const assets: QueryResolvers['assets'] = () => {
  return db.asset.findMany()
}

export const asset: QueryResolvers['asset'] = ({ id }) => {
  return db.asset.findUnique({
    where: { id },
  })
}

export const createAsset: MutationResolvers['createAsset'] = ({ input }) => {
  return db.asset.create({
    data: input,
  })
}

export const updateAsset: MutationResolvers['updateAsset'] = ({
  id,
  input,
}) => {
  return db.asset.update({
    data: input,
    where: { id },
  })
}

export const deleteAsset: MutationResolvers['deleteAsset'] = ({ id }) => {
  return db.asset.delete({
    where: { id },
  })
}

export const Asset: AssetRelationResolvers = {
  uploadUrl: async (_obj, { id }) => {
    const asset = await db.asset.findUnique({ where: { id } })
    if (!asset) {
      throw new Error('Asset not found')
    }
    return getUploadUrl(asset.filename)
  },
  url: async (_obj, { id }) => {
    const asset = await db.asset.findUnique({ where: { id } })
    if (!asset) {
      throw new Error('Asset not found')
    }
    return getUrl(asset.filename)
  },
  Player: (_obj, { root }) => {
    return db.asset.findUnique({ where: { id: root?.id } }).Player()
  },
}
