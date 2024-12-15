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

const minioClient = new Client({
  endPoint: MINIO_ENDPOINT || 'localhost',
  port: parseInt(MINIO_PORT || '9000', 10),
  useSSL: MINIO_USE_SSL === 'true',
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

export const uploadFile = async (bucketName: string, fileName: string, file: File, metaData = {}) => {
  try {
    // Transforme le fichier en flux Blob pour MinIO
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const fileSize = buffer.length;

    await minioClient.putObject(bucketName, fileName, buffer, fileSize, metaData);
    return `File ${fileName} uploaded successfully to ${bucketName}`;
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

export const getFileUrl = async (bucketName: string, fileName: string) => {
  try {
    const url = await minioClient.presignedGetObject(bucketName, fileName);
    return url;
  } catch (error) {
    throw new Error(`Error generating file URL: ${error.message}`);
  }
};

export default minioClient;
