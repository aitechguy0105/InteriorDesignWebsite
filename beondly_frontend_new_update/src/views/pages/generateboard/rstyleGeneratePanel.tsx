import React from 'react'

import { Card, Button } from '@mui/material'
import EditBoard from 'src/views/components/editBoard'
import RestyleImage from './restyleImage'

const RestyleGeneratePanel = ({
  inputPath,
  videoPath,
  setMaskImage,
  width,
  height,
  uploadVideoLink,
  uploadVideoID,
  uploadImageLink,
  setUploadImageLink,
  setInputPath,
  setOpenEditModal,
  setGenRoom,
  toggle,
  setToggle
}: {
  inputPath: string
  videoPath: string
  setMaskImage: (any: any) => void
  width: number
  height: number
  uploadVideoLink: string
  uploadVideoID: number
  uploadImageLink: string
  setUploadImageLink: (string: string) => void
  setInputPath: (string: string) => void
  setOpenEditModal: (boolean: boolean) => void
  setGenRoom: (boolean: boolean) => void
  toggle: boolean
  setToggle: (boolean: boolean) => void
}) => {
  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '@media (min-width: 900px)': {
          height: 'calc(100vh - 270px)'
        },
        position: 'relative'
      }}
      className='scroll'
    >
      <Button
        variant='contained'
        onClick={() => {
          toggle ? setToggle(false) : setToggle(true)
        }}
        sx={{ position: 'absolute', top: '40px', left: '10px', zIndex: 3, width: '100px' }}
      >
        {toggle ? 'edit' : 'project'}
      </Button>
      {toggle ? (
        <RestyleImage
          setUploadImageLink={setUploadImageLink}
          setInputPath={setInputPath}
          setOpenEditModal={setOpenEditModal}
          setGenRoom={setGenRoom}
          setToggle={setToggle}
        />
      ) : (
        <EditBoard
          width={width}
          height={height}
          inputPath={inputPath}
          videoPath={videoPath}
          uploadVideoLink={uploadVideoLink}
          uploadVideoID={uploadVideoID}
          uploadImageLink={uploadImageLink}
          setMaskImage={setMaskImage}
        />
      )}
    </Card>
  )
}

export default RestyleGeneratePanel
