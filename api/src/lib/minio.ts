import { Client } from 'minio'
import { minioLogger } from 'src/lib/logger'

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT
const MINIO_PORT = process.env.MINIO_PORT
const MINIO_USE_SSL = process.env.MINIO_USE_SSL
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY
const MINIO_BUCKET = process.env.MINIO_BUCKET

if (!MINIO_ENDPOINT) {
  throw new Error('Missing REDWOOD_ENV_MINIO_ENDPOINT');
}
if (!MINIO_PORT) {
  throw new Error('Missing REDWOOD_ENV_MINIO_PORT');
}
if (!MINIO_USE_SSL) {
  throw new Error('Missing REDWOOD_ENV_MINIO_USE_SSL');
}
if (!MINIO_ACCESS_KEY) {
  throw new Error('Missing REDWOOD_ENV_MINIO_ACCESS_KEY');
}
if (!MINIO_SECRET_KEY) {
  throw new Error('Missing REDWOOD_ENV_MINIO_SECRET_KEY');
}
if (!MINIO_BUCKET) {
  throw new Error('Missing REDWOOD_ENV_MINIO_BUCKET');
}

const minio = new Client({
  endPoint: MINIO_ENDPOINT || 'localhost',
  port: parseInt(MINIO_PORT || '9000', 10),
  useSSL: MINIO_USE_SSL === 'true',
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
})

export const checkIfBucketExists = async () => {
  try {
    await minio.bucketExists(process.env.MINIO_BUCKET)
    minioLogger.info(`Bucket ${process.env.MINIO_BUCKET} exists`)
  } catch {
    minioLogger.error(`Bucket ${process.env.MINIO_BUCKET} does not exist`)
    process.exit(1)
  }
}

checkIfBucketExists().catch(() => {
  process.exit(1)
})

export const getUrl = (objectName: string) => {
  return `${process.env.MINIO_USESSL === 'true' ? 'https' : 'http'}://${
    process.env.MINIO_ENDPOINT
  }:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${objectName}`
}
export const getUploadUrl = async (objectName: string) => {
  const url = await minio.presignedPutObject(
    process.env.MINIO_BUCKET,
    objectName
  )
  minioLogger.info(`Generating presigned upload URL for ${objectName}: ${url}`)
  return url
}
minioLogger.info('Client created')

export default minio
