// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Card, Grid, Typography } from '@mui/material'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import { ProjectInterface } from 'src/context/types'
import { getTagging } from 'src/pages/api/myProjectService'
// import AwsS3DLComponent from '../awsS3DLComponent/indes'
import SwiperModal from '../swiperModal'
import AwsS3DLComponent from '../awsS3DLComponent/indes'

// Styled component for the form

const ProjectItemModal = ({
  open,
  setOpen,
  item,
  setShowTagging,
  setTaggingImage
}: {
  open: boolean
  setOpen: (boolean: boolean) => void
  item: ProjectInterface
  setShowTagging: (boolean: boolean) => void
  setTaggingImage: (string: string) => void
}) => {
  // ** States
  const [taggings, setTaggings] = useState<string[]>([])
  let itemArray: string[] = item?.url ?? []
  itemArray = [item?.baseUrl, ...itemArray]
  // const getTag = async () => {
  //   const tagPromises = itemArray.map(async itemUrl => {
  //     const res = await getTagging(itemUrl)
  //     return res ? res.tagging : 'false'
  //   })

  //   return Promise.all(tagPromises)
  // }

  // useEffect(async () => {
  //   getTag().then(temp => {
  //     console.log('ssssssssss', taggings)
  //     setTaggings(temp)
  //   })
  // }, [])

  // getTag().then(temp => {
  //   // console.log('ssssssssss', taggings)
  //   setTaggings(temp)
  // })

  // useEffect(() => {
  //   //   if (itemArray.length <= 3) {
  //   // itemArray = [item?.baseUrl, ...itemArray]
  // // }
  // if ()
  // }, [item]);

  const [openswiper, setOpenSwiper] = useState<boolean>(false)
  const [initShow, setInitShow] = useState<number>(0)
  const handleClose = () => setOpen(false)

  // const handleDownload = async (imageUrl: string, filename: string) => {
  //   const res = downloadProject(imageUrl, filename)
  //   res
  //     .then(({ data }: any) => {
  //       console.log(data)
  //       const img = document.createElement('img')
  //       img.src = 'data:image/jpeg;base64,' + btoa(data)
  //       document.body.appendChild(img)

  //       download(data.path, filename)
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }

  // const download = async (path: string, filename: string) => {
  //   fetch(path)
  //     .then(response => {
  //       response
  //         .blob()
  //         .then(blob => {
  //           const url = window.URL.createObjectURL(blob)
  //           const a = document.createElement('a')
  //           a.href = url
  //           a.download = filename + '.png'
  //           a.click()
  //           window.URL.revokeObjectURL(url)
  //         })
  //         .catch(error => {
  //           console.log(error)
  //         })
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={'lg'}
        aria-labelledby='max-width-dialog-title'
        sx={{ background: 'none', border: '0px', backgroundColor: '#00000000' }}
        className='scroll'
      >
        <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid sx={{ display: 'flex', gap: 2, background: 'none', border: '0px none' }}>
            <Card sx={{ padding: 0, position: 'relative', width: '50%'}}>
              <Typography
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: 10,
                  background: '#1d1d1d80',
                  px: 5,
                  py: 1,
                  borderRadius: 1
                }}
              >
                オリジナル
              </Typography>
              <img
                src={itemArray[0]}
                alt='generated image'
                style={{
                  borderRadius: '8px',
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setOpenSwiper(true)
                  setInitShow(0)
                }}
              />
            </Card>
            <Card sx={{ padding: 0, position: 'relative', width: '50%' }}>
              <Typography
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: 10,
                  background: '#1d1d1d80',
                  px: 5,
                  py: 1,
                  borderRadius: 1
                }}
              >
                NEW
              </Typography>
              <Typography
                sx={{
                  position: 'absolute',
                  left: 20,
                  bottom: 10,
                  background: '#1d1d1d80',
                  px: 5,
                  py: 1,
                  borderRadius: 1
                }}
              >
                {item.prompt}
              </Typography>
              <AwsS3DLComponent url={itemArray[1]} name={item.name} />
              <img
                src={itemArray[1]}
                alt='generated image'
                style={{ borderRadius: '8px', width: '100%', height: '100%', cursor: 'pointer' }}
                onClick={() => {
                  setOpenSwiper(true)
                  setInitShow(1)
                }}
              />
            </Card>
          </Grid>
          <Grid sx={{ display: 'flex', gap: 2, background: 'none', border: '0px none' }}>
            <Card sx={{ padding: 0, position: 'relative' }}>
              <Typography
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: 10,
                  background: '#1d1d1d80',
                  px: 5,
                  py: 1,
                  borderRadius: 1
                }}
              >
                NEW
              </Typography>
              <Typography
                sx={{
                  position: 'absolute',
                  left: 20,
                  bottom: 10,
                  background: '#1d1d1d80',
                  px: 5,
                  py: 1,
                  borderRadius: 1
                }}
              >
                {item.prompt}
              </Typography>
              <AwsS3DLComponent url={itemArray[2]} name={item.name} />
              <img
                src={itemArray[2]}
                alt='generated image'
                style={{
                  borderRadius: '8px',
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setOpenSwiper(true)
                  setInitShow(2)
                }}
              />
            </Card>
            <Card sx={{ padding: 0, position: 'relative' }}>
              <Typography
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: 10,
                  background: '#1d1d1d80',
                  px: 5,
                  py: 1,
                  borderRadius: 1
                }}
              >
                NEW
              </Typography>
              <Typography
                sx={{
                  position: 'absolute',
                  left: 20,
                  bottom: 10,
                  background: '#1d1d1d80',
                  px: 5,
                  py: 1,
                  borderRadius: 1
                }}
              >
                {item.prompt}
              </Typography>
              <AwsS3DLComponent url={itemArray[3]} name={item.name} />
              <img
                src={itemArray[3]}
                alt='generated image'
                style={{ borderRadius: '8px', width: '100%', height: '100%', cursor: 'pointer' }}
                onClick={() => {
                  setOpenSwiper(true)
                  setInitShow(3)
                }}
              />
            </Card>
          </Grid>
        </Grid>
      </Dialog>
      <SwiperModal
        open={openswiper}
        setOpen={setOpenSwiper}
        setPrevOpen={setOpen}
        images={itemArray}
        setShowTagging={setShowTagging}
        setTaggingImage={setTaggingImage}
        initShow={initShow}
      />
    </Fragment>
  )
}

export default ProjectItemModal
