import { PaintBoard } from 'src/views/utils/paintBoard'
import { CANVAS_ELE_TYPE } from 'src/views/utils/constants'
import { useSpaceEvent } from 'src/hooks/event'
import { CURSOR_TYPE } from 'src/views/utils/cursor'
import { TextEdit } from 'src/views/utils/element/text'
import ReactPlayer from 'react-player'
import Loading from 'src/views/components/loading'
import api from 'src/configs/api'

// ** MUI Imports

import { Fragment } from 'react'
// ** MUI Imports
import Dialog from '@mui/material/Dialog'

import { Grid, Button, Checkbox, Typography } from '@mui/material'
import ToolPanel from '../paintComponent/toolPanel'
import { useMemo, useState, MouseEvent, useEffect, useRef } from 'react'
import { drawCircle } from 'src/views/utils/element/freeDraw'
import { WebIdentityCredentials } from 'aws-sdk'
import { bool } from 'aws-sdk/clients/signer'

const textEdit = new TextEdit()

const EditBoard = ({
  width,
  height,
  inputPath,
  videoPath,
  uploadVideoLink,
  uploadVideoID,
  uploadImageLink,
  setMaskImage
}: {
  width: number
  height: number
  inputPath: string
  videoPath?: string
  uploadVideoLink?: string
  uploadVideoID?: number
  uploadImageLink: string
  setMaskImage: (string: string) => void
}) => {
  // ** States

  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)
  const [painterWidth, setPainterWidth] = useState<number>(20)
  const board = useMemo(() => {
    console.log('width: ', width, ' height: ', height)
    if (canvasRef) {
      return new PaintBoard(canvasRef, width, height)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, width])

  // 工具类型
  // const [toolType] = useState<string>(CANVAS_ELE_TYPE.FREE_DRAW)
  const [toolType, setToolType] = useState<string>(CANVAS_ELE_TYPE.FREE_DRAW)

  const handleToolType = (type: string) => {
    if (board) {
      if (type !== CANVAS_ELE_TYPE.SELECT) {
        board.select.cancelSelectElement()
      }
      setToolType(type)
      board.render()
    }
  }

  // 是否按下空格
  const isPressSpace = useSpaceEvent(
    () => {
      if (board) {
        board.cursor.change(CURSOR_TYPE.POINTER)
        board.initOriginPosition()
      }
    },
    () => {
      if (board) {
        board.cursor.reset()
      }
    }
  )

  // 监听鼠标事件
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)
  const mouseDown = (event: MouseEvent) => {
    if (board) {
      const { clientX: x, clientY: y } = event
      const position = {
        x,
        y
      }

      // 如果有文本编辑框，取消编辑
      if (textEdit) {
        board.addTextElement(textEdit.value, textEdit.rect)
        textEdit.destroy()
      }
      switch (toolType) {
        case CANVAS_ELE_TYPE.SELECT:
          board.select.clickSelectElement(position)
          break
        case CANVAS_ELE_TYPE.FREE_DRAW:
        case CANVAS_ELE_TYPE.ERASER:
          if (!isPressSpace) {
            board.recordCurrent(toolType)
          }
          break
        default:
          break
      }
      setIsMouseDown(true)
    }
  }
  const dbClick = (event: MouseEvent) => {
    if (board) {
      const { clientX: x, clientY: y } = event
      const position = {
        x,
        y
      }

      // 双击展示文字输入框
      textEdit.showTextInput(position)
    }
  }
  const mouseMove = (event: MouseEvent) => {
    if (board) {
      const { clientX: x, clientY: y } = event

      drawCircle(x, y)
      if (isPressSpace && isMouseDown) {
        board.dragCanvas({
          x,
          y
        })
      } else {
        switch (toolType) {
          case CANVAS_ELE_TYPE.SELECT:
            board.select.moveSelectElement({
              x,
              y
            })
            break
          case CANVAS_ELE_TYPE.FREE_DRAW:
          case CANVAS_ELE_TYPE.ERASER:
            if (isMouseDown) {
              board.currentAddPosition({
                x,
                y
              })
            }
            break
          default:
            break
        }
      }
    }
  }
  const mouseUp = () => {
    if (board) {
      setIsMouseDown(false)
      board.canvasMouseUp()
    }
  }

  //for segment part
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [tagState, setTagState] = useState<boolean>(false)
  const [uploadState, setUploadState] = useState<boolean>(false)
  const [tagArray, setTagArray] = useState<string[]>([])
  const [values, setValues] = useState<any[]>([])
  const [tagStateArray, setTagStateArray] = useState<boolean[]>([])
  const [maskedImage, setMaskedImage] = useState<any>(null)
  const [imageWidth, setImageWidth] = useState<number>()
  const [imageHeight, setImageHeight] = useState<number>()
  const [allTagState, setAllTagState] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const data = { selectedImage }
  const [videoTagState, setVideoTagState] = useState<boolean>(false)
  const [taggedVideo, setTaggedVideo] = useState<string>()
  const [open, setOpen] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const color_data = require('./color_data2.json')
  const canvasOrigin = useRef<HTMLCanvasElement>(null)
  const canvas_Mask = useRef<HTMLCanvasElement>(null)
  const fetchImageAsBase64 = async (url: string, callback: any) => {
    // Fetch the image
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        return response.blob()
      })
      .then(blob => {
        // Create a FileReader
        const reader = new FileReader()

        // Convert the blob to base64
        reader.readAsDataURL(blob)

        // On load, call the callback with the base64 string
        reader.onloadend = function () {
          callback(reader.result)
        }
      })
      .catch(error => {
        console.error('Fetch error:', error)
        callback(null)
      })
  }

  useEffect(() => {
    console.log('UploadImageLink Changed', uploadImageLink)
    fetchImageAsBase64(uploadImageLink, function (base64: any) {
      // console.log(base64)
      setSelectedImage(base64) // This is your base64 string
    })
    setTagState(false)
    setVideoTagState(false)
  }, [uploadImageLink])

  useEffect(() => {
    console.log('UploadVideoLink Changed', uploadVideoLink)
    setTagState(false)
    setTaggedVideo('')
    setVideoTagState(false)
  }, [uploadVideoLink])

  // Function to poll for task status
  function pollForStatus(taskId: string) {
    const interval = setInterval(async () => {
      const url = api.API + api.videoTaggingStatusEndpoint + taskId
      const statusRes = await fetch(url)
      const statusData = await statusRes.json()
      console.log(statusData)
      if (statusData.status === 'SUCCESS' || statusData.status === 'FAILURE') {
        clearInterval(interval)
        // Handle completed task

        if (statusData.status === 'SUCCESS') {
          console.log(statusData)
          setTaggedVideo(statusData.result)
          setVideoTagState(true)
          setLoading(false)
        } else {
          // setVideoTagState(true)
          setLoading(false)
          setOpen(true)
        }
      }
    }, 10000) // Poll every 5 seconds
  }

  const handleVideoTagging = async () => {
    if (taggedVideo) {
      setVideoTagState(true)
    } else {
      setLoading(true)
      const accesstoken: any = localStorage.getItem('accessToken') || null
      const url = api.API + api.videoTaggingEndpoint

      // Function to start the task and receive task ID
      // async function startTask() {
      // Your existing fetchWithTimeout call
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accesstoken
        },
        body: JSON.stringify({
          url: uploadVideoLink,
          id: uploadVideoID
        })
      })
      const data = await res.json()
      const taskId = data.task_id
      // Start polling for status
      pollForStatus(taskId)
      // }
    }
    // const res = await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + accesstoken
    //   },
    //   body: JSON.stringify({
    //     url: uploadVideoLink,
    //     id: uploadVideoID
    //   })
    // })
    // console.log('----------', res)
    // if (res.ok) {
    //   const response = await res.json()
    //   console.log(response)
    //   setTaggedVideo(response.result)
    //   setVideoTagState(true)
    //   setLoading(false)
    // }
  }

  const handleAutoTagging = async () => {
    setLoading(true)

    // console.log("SELE", selectedImage);
    // const data = "sdfdsfds"

    const i = new Image()

    i.onload = function () {
      setImageWidth(i.width)
      setImageHeight(i.height)
    }

    i.src = selectedImage
    const accesstoken: any = localStorage.getItem('accessToken') || null
    const url = api.API + api.imageTaggingEndpoint
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accesstoken
      },
      body: JSON.stringify({
        origin: uploadImageLink
      })
    })
    console.log('----------', res)

    // const res = await fetch(process.env.NEXT_PUBLIC_SEGMENT_SERVER, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(data)
    // })
    // console.log('Response', res)
    if (res.ok) {
      const response = await res.json()
      console.log(response)
      const json_data = JSON.parse(response.result)

      setTagArray(Object.keys(json_data))
      setValues(Object.values(json_data))
      const tag_array = new Array(Object.keys(json_data).length).fill(false)
      setTagStateArray(tag_array)

      setTagState(true)
      setLoading(false)
    }
  }

  const handleTagChange = (idx: number) => {
    setTagStateArray(prevState => {
      const newCheckedState = [...prevState]
      newCheckedState[idx] = !newCheckedState[idx]

      return newCheckedState
    })
  }

  const handleAllTagChange = () => {
    const temp_Array = new Array(tagArray.length).fill(!allTagState)
    setTagStateArray(temp_Array)
    setAllTagState(!allTagState)
  }

  useEffect(() => {
    if (tagState) {
      console.log('Image Changed')
      const canvas = canvasOrigin.current
      // canvas.width = imageWidth
      // canvas.height = imageHeight
      canvas.width = 768
      canvas.height = 512

      const ctx = canvas.getContext('2d')

      // Create a new Image object
      const img = new Image()

      // Set the source of the Image object to the base64 string
      img.src = selectedImage

      // Add an event listener to ensure the image is loaded before drawing
      const canvas_mask = canvas_Mask.current
      canvas_mask.width = imageWidth
      canvas_mask.height = imageHeight
      const ctx_mask = canvas_mask.getContext('2d')
      ctx_mask.fillStyle = 'black'
      ctx_mask.fillRect(0, 0, imageWidth, imageHeight)
      img.onload = function () {
        ctx.drawImage(img, 0, 0, 768, 512)

        // console.log(tagStateArray)
        for (let i = 0; i < tagArray.length; i++) {
          // console.log(tagArray[i], ":::", tagStateArray[i])
          if (tagStateArray[i] === true) {
            // console.log("MakeMasking", tagArray[i])
            drawMask(values[i], tagArray[i])
          }
        }

        // Draw the mask after the image is loaded onto the canvas
      }
    }
  }, [selectedImage, tagArray, tagState, tagStateArray, values])

  const drawMask = (contoursArray: any[], tag_name: string) => {
    const temp_width = imageWidth / 768
    const temp_height = imageHeight / 512
    const canvas = canvasOrigin.current
    const ctx = canvas.getContext('2d')
    const canvas_mask = canvas_Mask.current
    const ctx_mask = canvas_mask.getContext('2d')

    const color = color_data[tag_name]
    console.log('tag', tag_name)
    console.log('color', color)
    ctx.fillStyle = color
    ctx_mask.fillStyle = 'white'
    ctx.beginPath()
    contoursArray.forEach(contour => {
      // ctx.beginPath();
      ctx.moveTo(contour[0][0] / temp_width, contour[0][1] / temp_height)
      ctx_mask.moveTo(contour[0][0], contour[0][1])
      contour.forEach(point => {
        ctx.lineTo(point[0] / temp_width, point[1] / temp_height)
        ctx_mask.lineTo(point[0], point[1])
      })

      // ctx.closePath();
      ctx.fill()
      ctx_mask.fill()
    })
    ctx.closePath()
    setMaskedImage(canvas_mask.toDataURL())
  }

  const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
  const c: CanvasRenderingContext2D | null = canvas?.getContext('2d')

  // Redraw the circle every time the mouse moves
  canvas?.addEventListener('mousemove', function (e) {
    drawCircle(e.clientX, e.clientY)
  })

  canvas?.addEventListener('mouseout', function (e) {
    c!.clearRect(0, 0, canvas.width, canvas.height)
  })

  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        '@media (min-width: 900px)': {
          height: 'calc(100vh - 270px)',
          overflowY: 'auto'
        },
        position: 'relative'
      }}
      className='scroll'
    >
      <ToolPanel
        board={board}
        toolType={toolType}
        setMaskImage={setMaskImage}
        setToolType={handleToolType}
        inputPath={inputPath}
        painterWidth={painterWidth}
        setPainterWidth={setPainterWidth}
      />
      {/* <canvas
        ref={setCanvasRef}
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
        onDoubleClick={dbClick}
        style={{ zIndex: 2 }}
      ></canvas> */}
      {/* {!tagState && <img src={inputPath} alt='' style={{ zIndex: 1, width: `${width}px`, height: `${height}px` }} />} */}

      {uploadImageLink && !tagState && !videoPath && (
        <div style={{ marginTop: '20px', textAlign: 'center', justifyContent: 'center' }}>
          <img src={selectedImage} alt='' style={{ zIndex: 1, width: '768px', height: '512px' }} />
          <Button
            variant='contained'
            sx={{ position: 'relative', top: '30px', right: '450px' }}
            onClick={handleAutoTagging}
          >
            Tagging
          </Button>
        </div>
      )}
      {videoPath && !videoTagState && (
        <div style={{ marginTop: '0px', textAlign: 'center', justifyContent: 'center' }}>
          <ReactPlayer
            url={videoPath}
            controls
            width='768px' // Set the width of the video player
            height='512px' // Set the height of the video player (auto adjusts to video aspect ratio)
          />
          {/* <video controls width='600' height='500'>
            <source src={videoPath} type='video/mp4' />
            Your browser does not support the video tag.
          </video> */}
          {/* <img src={selectedImage} alt='' style={{ zIndex: 1, width: `${width}px`, height: `${height}px` }} /> */}
          <Button
            variant='contained'
            // sx={{ position: 'relative', top: '30px', right: '400px' }}
            onClick={handleVideoTagging}
          >
            Tagging
          </Button>
        </div>
      )}
      {videoTagState && (
        <div style={{ marginTop: '0px', textAlign: 'center', justifyContent: 'center' }}>
          <ReactPlayer
            url={taggedVideo}
            controls
            width='768px' // Set the width of the video player
            height='512px' // Set the height of the video player (auto adjusts to video aspect ratio)
          />
          <Button
            variant='contained'
            // sx={{ position: 'relative', top: '30px', right: '400px' }}
            onClick={() => setVideoTagState(false)}
          >
            Origin
          </Button>
          {/* <video controls width='600' height='500'>
            <source src={videoPath} type='video/mp4' />
            Your browser does not support the video tag.
          </video> */}
          {/* <img src={selectedImage} alt='' style={{ zIndex: 1, width: `${width}px`, height: `${height}px` }} /> */}
        </div>
      )}
      {tagState && (
        <div style={{ marginTop: '30px', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            {/* Canvas which will display the original image with the mask */}
            <canvas
              ref={canvasOrigin}
              style={{ marginTop: '100px', zIndex: 2 }}
              onMouseDown={mouseDown}
              onMouseMove={mouseMove}
              onMouseUp={mouseUp}
              onDoubleClick={dbClick}
            ></canvas>
          </div>
          <br />
          <div
            style={{
              width: '100%',
              marginLeft: '0px',
              marginRight: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridRowGap: '10px'
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <Button
                id='all'
                variant='contained'
                onClick={handleAllTagChange}
                sx={{
                  color: !allTagState ? '#FEE9FD' : '#F88BDD',
                  backgroundColor: !allTagState ? '#F88BDD' : '#FEE9FD'
                }}
              >
                All
              </Button>
            </div>
            {tagArray.map((tag, index) => (
              <div key={index} className='checkbox-item'>
                <Button
                  id={`tag-${index}`}
                  variant='contained'
                  onClick={() => handleTagChange(index)}
                  sx={{
                    color: !tagStateArray[index] ? '#FFFFFF' : '#6962FF',
                    backgroundColor: !tagStateArray[index] ? '#6962FF' : '#F1F1FD'
                  }}
                >
                  {tag.split(',')[0]}
                </Button>
              </div>
            ))}
          </div>
          {/* <div className="generate-wrapper">
              <button className='generate-button' onClick={getImage}>Generate</button>
          </div> */}
        </div>
      )}
      <Loading open={loading} />
      <Fragment>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth={'lg'}
          aria-labelledby='max-width-dialog-title'
          sx={{ border: '0px none', background: '#0f0f0f00' }}
        >
          <Grid sx={{ p: 10 }}>
            <Typography color={'#40f1ff'} fontWeight={600} sx={{ pb: 4 }}>
              ご提案が出来ませんでした。
            </Typography>
            <Typography color={'#40f1ff'} fontWeight={600}>
              再度お試しください。
            </Typography>
          </Grid>
          <Grid sx={{ display: 'flex', justifyContent: 'center', p: 2, gap: 6 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'white', border: '1px solid white' }}>
              閉じる
            </Button>
            <Button onClick={handleVideoTagging} sx={{ color: 'white', border: '1px solid white' }} autoFocus>
              再生成する
            </Button>
          </Grid>
        </Dialog>
      </Fragment>
      <div style={{ display: 'none' }}>
        {/* Canvas which will display the original image with the mask */}
        <canvas ref={canvas_Mask}></canvas>
      </div>
    </Grid>
  )
}

export default EditBoard
