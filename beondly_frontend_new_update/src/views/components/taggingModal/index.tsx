//@ts-nocheck
import { useState, useEffect, useRef } from 'react'

import { ProjectInterface } from 'src/context/types'
import { Grid, Button, Checkbox, ToggleButton } from '@mui/material'
import { getTagging } from 'src/pages/api/myProjectService'
import { type } from 'os'
import { SelectElement } from 'src/views/utils/select'

const TaggingPanel = ({ showTagging, taggingImage }: { showTagging: boolean; taggingImage: string }) => {
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
  const [tagDataString, setTagDataString] = useState<any>([])

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
    if (!showTagging) {
      setTagState(false)
    }
  }, [showTagging])

  useEffect(() => {
    console.log('UploadImageLink Changed', taggingImage)
    if (taggingImage) {
      const res = getTagging(taggingImage)
      res
        .then(({ data }: any) => {
          setTagDataString(data)
        })
        .catch(error => {
          console.log(error)
        })
    }

    fetchImageAsBase64(taggingImage, function (base64: any) {
      // console.log(base64)
      setSelectedImage(base64) // This is your base64 string
    })

    // setTagState(false)
  }, [taggingImage])

  useEffect(() => {
    if (selectedImage) {
      const i = new Image()

      i.onload = function () {
        setImageWidth(i.width)
        setImageHeight(i.height)
      }

      i.src = selectedImage
    }
    if (tagDataString) {
      try {
        const json_data = JSON.parse(tagDataString.tagging)
        console.log(typeof json_data)
        setTagArray(Object.keys(json_data))
        setValues(Object.values(json_data))
        const tag_array = new Array(Object.keys(json_data).length).fill(false)
        setTagStateArray(tag_array)
        setTagState(true)
      } catch {
        console.log('Not now')
      }
    }
  }, [selectedImage, tagDataString])

  const handleAutoTagging = async () => {
    const i = new Image()

    i.onload = function () {
      setImageWidth(i.width)
      setImageHeight(i.height)
    }

    i.src = selectedImage
    console.log(selectedImage)

    const json_data = JSON.parse(tagDataString.tagging)
    console.log(typeof json_data)
    setTagArray(Object.keys(json_data))
    setValues(Object.values(json_data))
    const tag_array = new Array(Object.keys(json_data).length).fill(false)
    setTagStateArray(tag_array)
    setTagState(true)
  }

  const handleTagChange = (idx: number) => {
    console.log(idx, 'Changed')
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

  return (
    <div style={{ display: 'flex' }}>
      <img
        src={selectedImage}
        alt='taggingImage'
        width='768px'
        height='512px'
        style={{ marginTop: '50px', marginLeft: '30px' }}
      />
      {tagState && (
        <div style={{ marginTop: '30px', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            {/* Canvas which will display the original image with the mask */}
            <canvas ref={canvasOrigin} style={{ marginTop: '20px' }}></canvas>
          </div>
          <br />
          <div
            style={{
              width: '100%',
              marginLeft: '50px',
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
        </div>
      )}
      {/*
      {!tagState && <button onClick={handleAutoTagging}>Tagging</button>} */}
      <div style={{ display: 'none' }}>
        {/* Canvas which will display the original image with the mask */}
        <canvas ref={canvas_Mask}></canvas>
      </div>
    </div>
  )
}

export default TaggingPanel
