import { Grid, Typography } from '@mui/material'
import { toast } from 'react-hot-toast'
import ImageThumnail from '../imageThumnail'

// import Resizer from 'react-image-file-resizer'

const FileuploadSingle = ({
  inputPath,
  setInputPath,
  videoPath,
  setVideoPath,
  uploadVideo,
  setUploadVideo,
  setUploadImage,
  setUploadFlag
}: {
  inputPath: string
  setInputPath: (string: string) => void
  videoPath: string
  setVideoPath: (string: string) => void
  uploadVideo: File
  setUploadVideo: (File: File) => void
  setUploadImage: (File: File) => void
  setUploadFlag: (boolean: boolean) => void
}) => {
  const fileToDataUri = (field: any) => {
    return new Promise(resolve => {
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        resolve(reader.result)
      })

      reader.readAsDataURL(field)
    })
  }

  const handleuploadImage = async (e: any) => {
    const fileObj: any = e.target.files[0]
    console.log(fileObj)
    // if (fileObj && fileObj.size < 30000) {
    //   toast.error('許可しないファイル形式です。 サイズが3M以上のファイルから対応しています。')

    //   return false
    // }
    if (fileObj && fileObj.size > 10000000) {
      toast.error('サイズが10M以上は駄目です。')
      
      return false
    }

    let imgUrl: any
    if (fileObj) {
      if (fileObj.type.split('/')[0] === 'image') {
        imgUrl = URL.createObjectURL(fileObj)
        console.log('----------------imgURL', imgUrl)
        const image: any = document.createElement('img')
        image.src = await fileToDataUri(fileObj)
        setUploadFlag(true)
        console.log('UploadImage-------->', fileObj)
        setUploadImage(fileObj)
        setInputPath(imgUrl)
        setVideoPath('')
      } else {
        imgUrl = URL.createObjectURL(fileObj)
        console.log('video', imgUrl)
        setVideoPath(imgUrl)
        setUploadVideo(fileObj)
        setInputPath('')
      }
    } else {
      setInputPath('')
    }
  }

  return (
    <Grid>
      <input
        onChange={e => {
          handleuploadImage(e)
        }}
        name='uploadImage'
        id='uploadImage'
        type='file'
        hidden
        accept='.png, .jpg, .jpeg, .mp4, .mpeg, .mov'
      />
      <label htmlFor='uploadImage'>
        <Grid border={'dashed'} sx={{ borderWidth: 2, borderRadius: 1, position: 'relative' }} minHeight={180}>

          {inputPath == '' ? <></> : <ImageThumnail imageUrl={inputPath} />}

          <Typography
            sx={{
              position: 'absolute',
              right: '50%',
              transform: 'translate(50%)',
              top: '50%'
            }}
            alignItems={'center'}
            right={1 / 2}
            bottom={1 / 2}
          >
            画像アップロード
          </Typography>
        </Grid>
      </label>
    </Grid>
  )
}

export default FileuploadSingle
