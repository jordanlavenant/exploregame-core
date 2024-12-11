import { getFileUrl, uploadFile } from 'src/lib/minio'

export const uploadImage = async ({ file }) => {
  const { filename, createReadStream } = await file

  const bucketName = 'images'
  const metaData = {
    'Content-Type': 'image/jpeg',
  }

  try {
    const fileStream = createReadStream()
    await uploadFile(bucketName, filename, fileStream, metaData)
    const fileUrl = await getFileUrl(bucketName, filename)
    return { filename, fileUrl }
  } catch (error) {
    throw new Error(`Error uploading image: ${error.message}`)
  }
}
