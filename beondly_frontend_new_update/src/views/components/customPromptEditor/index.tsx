import { Grid, Typography, TextField } from '@mui/material'

const CustomPromptEditor = ({
  customPrompt,
  setCustomPrompt
}: {
  customPrompt: string
  setCustomPrompt: (string: string) => void
}) => {
  const handlePrompt = (e: any) => {
    console.log('CustomPrompt', customPrompt)
    setCustomPrompt(e.target.value)
  }

  return (
    <Grid>
      <label htmlFor='customPrompt'>
        <Typography>テキスト入力(プロンプト)</Typography>
      </label>
      <TextField
        id='standard-textarea'
        color='secondary'
        multiline
        variant='outlined'
        focused
        fullWidth
        onChange={handlePrompt}
        sx={{ marginTop: '5px' }}
      />
    </Grid>
  )
}

export default CustomPromptEditor
