import { useState } from 'react'
import { Checkbox, Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import styled from 'styled-components'

interface IItem {
  title: string
  image: any
  value: string
}

const ItemContainer = styled.div`
  position: relative;
  border: solid 2px #ccc;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border: solid 2px #fff;
  }
`

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
`

const ItemTitle = styled.div`
  position: absolute;
  bottom: 0;
  height: 30px;
  width: 100%;
  background-color: gray;
  text-align: center;
  color: white;
`

const ItemCheckBox = styled(Checkbox)`
  position: absolute;
  top: 6px;
  right: 6px;
`

interface PickerModalProps {
  open: boolean
  setOpen: (boolean: boolean) => void

  confirm: (items: IItem[]) => void
  items: IItem[]
  title: string
}

const PickerModal: React.FC<PickerModalProps> = ({ items, open, setOpen, confirm, title }) => {
  const [checkedItems, setCheckedItems] = useState<IItem[]>([])

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = () => {
    confirm(checkedItems)
    setOpen(false)
  }

  const onCheckChange = (item: IItem) => (e: any) => {
    if (e.target.checked) {
      setCheckedItems([...checkedItems, item])
    } else {
      setCheckedItems(checkedItems.filter((_item: IItem) => _item !== item))
    }
  }

  const onItemClick = (item: IItem) => () => {
    if (checkedItems.find(_item => _item === item)) {
      setCheckedItems(checkedItems.filter((_item: IItem) => _item !== item))
    } else {
      setCheckedItems([...checkedItems, item])
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='sm'
        fullWidth
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent sx={{ overflowY: 'auto' }} className='scroll'>
          <Grid container spacing={2}>
            {items.map((item: IItem) => (
              <Grid key={item.title} xs={4} sm={4} md={4} item>
                <ItemContainer onClick={onItemClick(item)}>
                  <ItemImage src={item.image} />
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemCheckBox onChange={onCheckChange(item)} checked={!!checkedItems.find(_item => _item === item)} />
                </ItemContainer>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color='primary' autoFocus>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default PickerModal
