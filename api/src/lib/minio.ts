import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.REDWOOD_ENV_MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.REDWOOD_ENV_MINIO_PORT || '9000', 10),
  useSSL: process.env.REDWOOD_ENV_MINIO_USE_SSL === 'true',
  accessKey: process.env.REDWOOD_ENV_MINIO_ACCESS_KEY || 'YOUR_ACCESS_KEY',
  secretKey: process.env.REDWOOD_ENV_MINIO_SECRET_KEY || 'YOUR_SECRET_KEY',
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
