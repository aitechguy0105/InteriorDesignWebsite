import { useState } from 'react'
// ** React Imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import { EffectCoverflow } from 'swiper/modules'

// ** MUI Imports
import { Button, Modal } from '@mui/material'

import { getTagging } from 'src/pages/api/myProjectService'
import TaggingModal from '../taggingModal'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/swiper-bundle.css'
import { CostExplorer } from 'aws-sdk'
import { useEffect } from 'react'
import { settings } from 'nprogress'
import { tr } from 'date-fns/locale'

const SwiperModal = ({
  open,
  setOpen,
  setPrevOpen,
  images,
  setShowTagging,
  setTaggingImage,
  initShow
}: {
  open: boolean
  setOpen: (boolean: boolean) => void
  setPrevOpen: (boolean: boolean) => void
  images: string[]
  setShowTagging: (boolean: boolean) => void
  setTaggingImage: (string: string) => void
  initShow: number
}) => {
  const [taggingState, setTraggingState] = useState<string[]>([])
  const handleClose = () => setOpen(false)
  // const taggings: string[] = ['true', 'true', 'false', 'false']
  // const getTag = async () => {
  //   for (let i = 0; i < images.length; i++) {
  //     const res = await getTagging(images[i])
  //     if (res) taggings[i] = res.tagging
  //     else taggings[i] = 'false'
  //   }
  //   console.log(taggings,  '>>>>>>>>>>>>>>>>')
  // }
  // getTag()
  // console.log(images[2])
  // console.log(taggings[2])

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby='image-modal' aria-describedby='image-modal-description'>
      <>
        <Swiper
          modules={[EffectCoverflow, Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          effect='coverflow'
          initialSlide={initShow}
        >
          {images?.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                {/* {taggingState[index] === 'false' ? ( */}
                <img
                  height={'100%'}
                  src={item}
                  alt={item}
                  style={{ display: 'block', margin: 'auto', marginTop: 150, borderRadius: '10px', cursor: 'pointer' }}
                  onClick={() => {
                    setShowTagging(true)
                    setTaggingImage(item)
                    setOpen(false)
                    setPrevOpen(false)
                  }}
                />
              </SwiperSlide>
            )
          })}
          {/* <div className='swiper-button-next' style={{ right: 400 }} onClick={() => swiper.slideNext()}></div>
          <div className='swiper-button-prev' style={{ left: 400 }} onClick={() => swiper.slidePrev()}></div> */}
        </Swiper>
        <Button sx={{ position: 'absolute', bottom: 100, right: 400, zIndex: 20 }} onClick={handleClose}>
          close
        </Button>
      </>
    </Modal>
  )
}

export default SwiperModal
