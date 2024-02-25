// ** React Imports
//@ts-nocheck
import { useState, SyntheticEvent, useEffect, MouseEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { setPrompt } from 'src/redux/slice/promptSlice'
import axios from 'axios'

import { Card, CardContent, Typography, Button, Grid } from '@mui/material'
import FileUploaderSingle from 'src/views/components/fileUploaderSingle'

//---
// import api from 'src/configs/api'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { toast } from 'react-hot-toast'
import Loading from 'src/views/components/loading'
import ErrorModal from 'src/views/components/errorModal'

// ** Data
import { RoomType } from 'src/context/types'
import { setTempUrl } from 'src/redux/slice/tempUrlSlice'
import {
  generateMaskRestyleImage,
  generateRestyleImage,
  generateByPromptImage,
  generateStagingImage,
  uploadImageService,
  uploadVideoService,
  uploadMaskService,
  uploadNoneMask
} from 'src/pages/api/dashboardService'
import { Box } from '@mui/system'
import { ProjectInterface } from 'src/context/types'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { designStyle, roomNameList } from 'src/context/promptValue'
import { CustomRadioImgData } from 'src/views/components/custom-radio/types'
import ShowResultModal from 'src/views/components/showResultModal'
import CustomPromptEditor from 'src/views/components/customPromptEditor'
import PickerModal from 'src/views/components/pickerModal'

import initial_data from './initial_data.json'
import { tr } from 'date-fns/locale'

// import { error } from 'console'
// import { addAPIProvider } from '@iconify/react'

const floorItems = initial_data['floor']
console.log('flooriTems', floorItems)
const colorItems = initial_data['color']
const materialItems = initial_data['material']

const Input = ({
  customPrompt,
  setCustomPrompt,
  inputPath,
  setInputPath,
  videoPath,
  setVideoPath,
  uploadVideo,
  setUploadVideo,
  paintState,
  setPaintState,
  uploadImage,
  setUploadImage,
  maskImage,
  setMaskImage,
  width,
  height,
  setSelected,
  uploadImageLink,
  setUploadImageLink,
  uploadVideoLink,
  setUploadVideoLink,
  setUploadVideoID,
  setOpenEditModal,
  genRoom,
  setGenRoom,
  setToggle,
  uploadToggle
}: {
  customPrompt: string
  setCustomPrompt: (string: string) => void
  inputPath: string
  setInputPath: (string: string) => void
  videoPath: string
  setVideoPath: (string: string) => void
  uploadVideo: File
  setUploadVideo: (File: File) => void
  paintState: boolean
  setPaintState: (boolean: boolean) => void
  uploadImage: File
  setUploadImage: (File: File) => void
  uploadVideoLink: string
  setUploadVideoLink: (string: string) => void
  maskImage: any
  setMaskImage: (any: any) => void
  width: number
  height: number
  setSelected: (number: number) => void
  uploadImageLink: string
  setUploadImageLink: (string: string) => void
  setUploadVideoID: (number: number) => void
  setOpenEditModal: (boolean: boolean) => void
  genRoom: boolean
  setGenRoom: (boolean: boolean) => void
  setToggle: (boolean: boolean) => void
  uploadToggle: boolean
}) => {
  const loginNote = () => toast.success('ユーザー登録をしてください。')

  const [upLoadMaskLink, setUpLoadMaskLink] = useState<string>('')

  const router = useRouter()

  // const [roomTypePrompt, setRoomTypePrompt] = useState<string>('Living room')

  const prompt = useSelector((state: any) => state.prompt)
  const dispatch = useDispatch()

  const [roomName, setRoomName] = useState<RoomType | null>({ title: 'リビング', value: 'LivingRoom', nameId: 0 })
  const [loading, setLoading] = useState<boolean>(false)
  const [showImage, setShowImage] = useState<boolean>(false)
  const [newProject, setNewProject] = useState<ProjectInterface>({
    id: 1,
    name: 'name',
    userId: 2,
    prompt: 'how',
    baseUrl: 'url',
    url: ['1'],
    createdAt: '',
    method: 'restyle'
  })
  const [showError, setShowError] = useState<boolean>(false)
  const [editPrompt, setEditPrompt] = useState<string>('')
  const [uploadFlag, setUploadFlag] = useState<boolean>(false)
  const [colorDlgOpen, setColorDlgOpen] = useState<boolean>(false)
  const [materialDlgOpen, setMaterialDlgOpen] = useState<boolean>(false)
  const [bottomDlgOpen, setBottomDlgOpen] = useState<boolean>(false)
  const [colorPicker, setColorPicker] = useState<string>('')
  const [materialPicker, setMaterialPicker] = useState<string>('')
  const [bottomPicker, setBottomPicker] = useState<string>('')
  const [colorPrompt, setColorPrompt] = useState<string>('')
  const [materialPrompt, setMaterialPrompt] = useState<string>('')
  const [bottomPrompt, setBottomPrompt] = useState<string>('')

  const handleChange = (event: any) => {
    setEditPrompt(event.target.value)
  }

  const handleColorPickerConfirm = (items: any[]) => {
    const joinedTitles = items.map(item => item.title).join(', ')
    const joinedValues = items.map(item => item.value).join(', ')
    setColorPicker(joinedTitles)
    setColorPrompt(joinedValues)
  }

  const handleMaterialPickerConfirm = (items: any[]) => {
    const joinedTitles = items.map(item => item.title).join(', ')
    const joinedValues = items.map(item => item.value).join(', ')
    setMaterialPicker(joinedTitles)
    setBottomPrompt(joinedValues)
  }

  const handleBottomPickerConfirm = (items: any[]) => {
    const joinedTitles = items.map(item => item.title).join(', ')
    const joinedValues = items.map(item => item.value).join(', ')
    setBottomPicker(joinedTitles)
    setMaterialPrompt(joinedValues)
  }

  const checkLogin = () => {
    const loginuserData = JSON.parse(localStorage.getItem('userData') as string) || null
    if (loginuserData != null) {
      return true
    } else {
      loginNote()
      router.replace('/auth/login')
    }
  }

  const handleAlignment = (event: MouseEvent<HTMLElement>, newAlignment: boolean | null) => {
    checkLogin()
    if (newAlignment !== null) {
      setPaintState(newAlignment)
      console.log(paintState)
    }
  }
  const [methodValue, setMethodValue] = useState('img2img')

  const handleMethod = (event: MouseEvent<HTMLElement>, newValue: string) => {
    console.log('methodValue', methodValue)
    setMethodValue(newValue)
  }
  const roomTypeHandleChange = (event: SyntheticEvent, newValue: RoomType | null) => {
    checkLogin()
    setRoomName(newValue)
    console.log(newValue)
  }

  const roomStyleHandleChange = (event: SyntheticEvent, newValue: CustomRadioImgData | null) => {
    checkLogin()
    dispatch(setPrompt({ prompt: newValue?.value }))
    console.log(newValue?.value)
    if (newValue) setSelected(newValue?.styleId)
  }

  const onColorPickerClick = () => {
    setColorDlgOpen(true)
  }

  const onMaterialPickerClick = () => {
    setMaterialDlgOpen(true)
  }

  const onBottomPickerClick = () => {
    setBottomDlgOpen(true)
  }

  useEffect(() => {
    if (genRoom) {
      console.log('generateroom')
      GenerateRoom()
    }
    console.log('genroom', genRoom)
    setGenRoom(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genRoom])

  const GenerateRoom = () => {
    // checkLogin()
    if (inputPath) {
      console.log('INPUT_PATH', inputPath)
      setLoading(true)
      console.log('maskImage', maskImage)
      if (maskImage) {
        const res = uploadMaskService(maskImage)
        res
          .then(({ data }: any) => {
            setUpLoadMaskLink(data.url)
            console.log('mask link' + data.url)
            setMaskImage('')
          })
          .catch(error => {
            console.log(error)
            setShowError(true)
            setLoading(false)
          })
      } else {
        if (paintState) {
          const res = uploadNoneMask(width, height)
          res
            .then(({ data }: any) => {
              setUpLoadMaskLink(data.url)
              console.log('mask link' + data.url)
              setMaskImage('')
            })
            .catch(error => {
              setShowError(true)
              setLoading(false)
              console.log(error)
            })
        } else {
          console.log('Generate Restyle')
          generateRestyle()
        }
      }
    } else {
      if (methodValue == 'text2img') {
        setLoading(true)
        console.log('Generate By Prompt')
        generateByPrompt()

        // setLoading(false)
      }
    }
  }

  const generateRestyle = async () => {
    console.log(uploadImageLink)
    if (uploadImageLink != '') {
      const name = 'newimage'
      const url = 'newurl'
      const originType = methodValue
      const transPrompt = editPrompt ? await translate(editPrompt) : ''
      console.log('@@@@@@@@@@@@@@@@', colorPicker, materialPicker, bottomPicker)
      const res = generateRestyleImage(
        name,
        roomName,
        prompt.prompt,
        transPrompt,
        colorPrompt,
        bottomPrompt,
        materialPrompt,
        uploadImageLink,
        url,
        originType
      )
      res
        .then(({ data }: any) => {
          if (data.state) {
            dispatch(setTempUrl({ tempUrl: data.genInfo }))
            setNewProject(data.genInfo)
            setShowImage(true)
          } else {
            setShowError(true)
          }
          setLoading(false)
        })
        .catch(error => {
          setShowError(true)
          setLoading(false)
          console.log(error)
        })
    }
  }

  //updated part

  const translate = async (query: string) => {
    const url = process.env.NEXT_PUBLIC_TRANS_SERVER

    try {
      const response = await axios.post(url, {
        query: query
      })

      return response.data.answer
    } catch (error) {
      // Handle error appropriately
      console.error('Error during translation request:', error)
      throw error
    }
  }

  const generateByPrompt = async () => {
    if (customPrompt != '') {
      const name = 'newImageByPrompt'
      const url = 'newImageByPromptUrl'
      console.log('Yes, Prompt')

      // setCustomPrompt(await translate(customPrompt))
      const transPrompt = editPrompt ? await translate(editPrompt) : ''
      const res = generateByPromptImage(
        name,
        roomName,
        prompt.prompt,
        transPrompt,
        colorPrompt,
        bottomPrompt,
        materialPrompt,
        url
      )
      res
        .then(({ data }: any) => {
          if (data.state) {
            dispatch(setTempUrl({ tempUrl: data.genInfo }))
            setNewProject(data.genInfo)
            setShowImage(true)
          } else {
            setShowError(true)
          }
          setLoading(false)
        })
        .catch(error => {
          setShowError(true)
          setLoading(false)
          console.log(error)
        })
    }
  }

  const generateMaskRestyle = async () => {
    console.log('paintStata', paintState)
    console.log('uploadImageLink', uploadImageLink)
    console.log('upLoadMaskLink', upLoadMaskLink)

    if (uploadImageLink != '' && upLoadMaskLink != '') {
      console.log('Here is MaskRestyle')
      const name = 'mask restyle'
      const url = 'new mask restyle'
      const transPrompt = editPrompt ? await translate(editPrompt) : ''
      const res = generateMaskRestyleImage(
        name,
        roomName,
        prompt.prompt,
        transPrompt,
        uploadImageLink,
        upLoadMaskLink,
        url,
        width,
        height
      )
      res
        .then(({ data }: any) => {
          if (data.state) {
            dispatch(setTempUrl({ tempUrl: data.genInfo }))
            setNewProject(data.genInfo)
            setShowImage(true)
          } else {
            setShowError(true)
          }
          setLoading(false)
        })
        .catch(error => {
          setShowError(true)
          setLoading(false)
          console.log(error)
        })
    }
  }

  const generateStaging = async () => {
    console.log('paintStata', paintState)
    console.log('uploadImageLink', uploadImageLink)
    console.log('upLoadMaskLink', upLoadMaskLink)

    if (uploadImageLink != '' && upLoadMaskLink != '') {
      console.log('Here is Staging')
      const name = 'stagingImage'
      const url = 'newstagingImage'
      const transPrompt = editPrompt ? await translate(editPrompt) : ''
      const res = generateStagingImage(
        name,
        roomName,
        prompt.prompt,
        transPrompt,
        uploadImageLink,
        upLoadMaskLink,
        url,
        width,
        height
      )
      res
        .then(({ data }: any) => {
          if (data.state) {
            dispatch(setTempUrl({ tempUrl: data.genInfo }))
            setNewProject(data.genInfo)
            setShowImage(true)
          } else {
            setShowError(true)
          }
          setLoading(false)
        })
        .catch(error => {
          setShowError(true)
          setLoading(false)
          console.log(error)
        })
    }
  }

  useEffect(() => {
    if (paintState) {
      generateStaging()
    } else {
      generateMaskRestyle()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upLoadMaskLink])

  useEffect(() => {
    if (uploadFlag) {
      setLoading(true)
      const res = uploadImageService(uploadImage, width, height)
      res
        .then(({ data }: any) => {
          console.log('This is data', data)
          console.log('UploadImgLink----------------', data.url)
          setUploadImageLink(data.url)
          setLoading(false)
          setUploadFlag(false)
        })
        .catch(error => {
          setShowError(true)
          setLoading(false)
          console.log(error)
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadToggle])

  useEffect(() => {
    console.log('$$$$$$$$$$$$$$$$$$$$')
    if (uploadVideo) {
      console.log(uploadVideo)
      setLoading(true)
      const res = uploadVideoService(uploadVideo)
      res
        .then(({ data }: any) => {
          console.log('UploadVideoLink-------------', data.url)
          setUploadVideoLink(data.url)
          setUploadVideoID(data.id)
          setLoading(false)
        })
        .catch(error => {
          setShowError(true)
          setLoading(false)
          console.log(error)
        })
    }
  }, [uploadVideo])

  return (
    <Card
      sx={{
        height: '100%',
        '@media (min-width: 900px)': {
          height: 'calc(100vh - 270px)',
          overflowY: 'auto'
        }
      }}
      className='scroll'
    >
      <CardContent>
        <Box color={'#40F1FF'} borderRadius={1} border={2}>
          <Typography paddingX={2} paddingY={4} color={'white'} fontSize={'body2'} fontWeight={400}>
            画像をアップロードして、 “生成方法”,”部屋のタイプ”,”スタイルを選び” プロンプト(任意)を入力して、スタート
          </Typography>
        </Box>
        <Grid item xs={12} sx={{ marginTop: '25px' }}>
          <ToggleButtonGroup
            exclusive
            value={methodValue}
            onChange={handleMethod}
            aria-label='text alignment'
            fullWidth
          >
            <ToggleButton value='img2img' aria-label='img2img'>
              <Typography sx={{ fontWeight: 500 }}>画像 to 画像</Typography>
            </ToggleButton>
            <ToggleButton value='text2img' aria-label='text2img'>
              <Typography sx={{ fontWeight: 500 }}>テキスト to 画像</Typography>
            </ToggleButton>
            <ToggleButton value='sketch2img' aria-label='sketch2img'>
              <Typography sx={{ fontWeight: 500 }}>スケッチ to 画像</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Typography
          alignItems={'center'}
          justifyContent={'center'}
          display={'flex'}
          fontSize={'body2'}
          fontWeight={400}
          sx={{ mt: 6, mb: 4 }}
          color={'#40F1FF'}
        >
          早速スタートする{' '}
        </Typography>
        {methodValue === 'text2img' ? (
          <CustomPromptEditor customPrompt={customPrompt} setCustomPrompt={setCustomPrompt} />
        ) : (
          <FileUploaderSingle
            inputPath={inputPath}
            setInputPath={setInputPath}
            videoPath={videoPath}
            setVideoPath={setVideoPath}
            uploadVideo={uploadVideo}
            setUploadVideo={setUploadVideo}
            setUploadImage={setUploadImage}
            setUploadFlag={setUploadFlag}
          />
        )}

        <Grid item xs={12}>
          <Typography fontSize={'body2'} fontWeight={400} sx={{ mt: 2, mb: 2, pl: 2 }} color={'white'}>
            生成方法の選択
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={paintState}
            onChange={handleAlignment}
            aria-label='text alignment'
            fullWidth
          >
            <ToggleButton value={false} aria-label='redesign'>
              <Typography sx={{ fontWeight: 500 }}>ステージングプロ</Typography>
            </ToggleButton>
            <ToggleButton value={true} aria-label='staging'>
              <Typography sx={{ fontWeight: 500 }}>Re-デザイン</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={'body2'} fontWeight={400} sx={{ mt: 2, mb: 2, pl: 2 }} color={'white'}>
            部屋のタイプを選択
          </Typography>
          <Autocomplete
            sx={{ width: 'full', color: '#40F1FF' }}
            options={roomNameList}
            id='autocomplete-outlined'
            getOptionDisabled={option => option === roomNameList[5]}
            getOptionLabel={option => option.title || ''}
            renderInput={params => <TextField {...params} label='部屋のタイプを選択' sx={{ color: '#40F1FF' }} />}
            onChange={roomTypeHandleChange}
            ListboxProps={{
              className: 'scroll'
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={'body2'} fontWeight={400} sx={{ mt: 2, mb: 2, pl: 2 }} color={'white'}>
            部屋のスタイルを選択
          </Typography>
          <Autocomplete
            sx={{ width: 'full', color: '#40F1FF' }}
            options={designStyle}
            id='autocomplete-outlined1'
            getOptionLabel={option => option.title || ''}
            renderInput={params => <TextField {...params} label='部屋のスタイルを選択' sx={{ color: '#40F1FF' }} />}
            onChange={roomStyleHandleChange}
            ListboxProps={{
              className: 'scroll'
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={'body2'} fontWeight={400} sx={{ mt: 2, mb: 2, pl: 2 }} color={'white'}>
            カラーから選択(複数選択可)
          </Typography>
          <TextField value={colorPicker} onClick={onColorPickerClick} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={'body2'} fontWeight={400} sx={{ mt: 2, mb: 2, pl: 2 }} color={'white'}>
            フロア材から選択(複数選択可)
          </Typography>
          <TextField value={materialPicker} onClick={onMaterialPickerClick} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={'body2'} fontWeight={400} sx={{ mt: 2, mb: 2, pl: 2 }} color={'white'}>
            マテリアルから選択(複数選択可)
          </Typography>
          <TextField value={bottomPicker} onClick={onBottomPickerClick} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={'body2'} fontWeight={400} sx={{ mt: 2, mb: 2, pl: 2 }} color={'white'}>
            プロンプトを入力
          </Typography>
          <TextField
            multiline
            maxRows={4}
            value={editPrompt}
            label='プロンプトを入力'
            onChange={handleChange}
            id='textarea-outlined-controlled'
            sx={{ width: '100%', color: '#40F1FF' }}
          />
        </Grid>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: 3
          }}
        >
          <Button
            variant='contained'
            sx={{ paddingY: 2, paddingX: 10, borderRadius: 5 }}
            onClick={() => setGenRoom(true)}
          >
            送信
          </Button>
        </Box>
      </CardContent>
      <Loading open={loading} />
      <ShowResultModal
        setToggle={setToggle}
        open={showImage}
        setOpen={setShowImage}
        project={newProject}
        setUploadImageLink={setUploadImageLink}
        setInputPath={setInputPath}
        setOpenEditModal={setOpenEditModal}
        setGenRoom={setGenRoom}
      />
      <ErrorModal open={showError} setOpen={setShowError} setGenRoom={setGenRoom} />
      <PickerModal
        open={colorDlgOpen}
        setOpen={setColorDlgOpen}
        items={colorItems}
        confirm={handleColorPickerConfirm}
        title='カラーから選択(複数選択可)'
      />
      <PickerModal
        open={materialDlgOpen}
        setOpen={setMaterialDlgOpen}
        items={floorItems}
        confirm={handleMaterialPickerConfirm}
        title='フロア材から選択(複数選択可)'
      />
      <PickerModal
        open={bottomDlgOpen}
        setOpen={setBottomDlgOpen}
        items={materialItems}
        confirm={handleBottomPickerConfirm}
        title='マテリアルから選択(複数選択可)'
      />
    </Card>
  )
}

export default Input
