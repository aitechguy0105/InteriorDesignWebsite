import AWS from 'aws-sdk'
import { downloadProject } from 'src/pages/api/myProjectService'

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_REGION
})

const s3 = new AWS.S3()

export const downloadImage = async (url: string, name: string) => {
  const res = downloadProject(url, name)
  res
    .then(async ({ data }: any) => {
      console.log(data)

      // s3.getObject({ Bucket: S3_BUCKET_NAME, Key: data.name }, function (error, data) {
      //   if (error != null) {
      //     alert('Failed to retrieve an object: ' + error)
      //   } else {
      //     alert('Loaded ' + data.ContentLength + ' bytes')

      //     // do something with data.Body
      //   }
      // })

      try {
        const params = {
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
          Key: data.name
        }
        const download_name: string = data.path.split('/')[data.path.split('/').length - 1] // You can set the download filename
        const response: any = await s3.getObject(params, undefined).promise()
        const imageBlob = new Blob([response.Body], { type: response.ContentType })
        const url = URL.createObjectURL(imageBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = download_name
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error downloading image:', error)
      }
    })
    .catch(error => {
      console.log(error)
    })
}
