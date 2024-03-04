import { configureStore } from '@reduxjs/toolkit'

import userSlice from './slice/userSlice'
import promptSlice from './slice/promptSlice'
import tempUrlSlice from './slice/tempUrlSlice'
import widthSlice from './slice/widthSlice'
import heightSlice from './slice/heightSlice'

export default configureStore({
  reducer: {
    user: userSlice,
    prompt: promptSlice,
    tempUrl: tempUrlSlice,
    width: widthSlice,
    height: heightSlice
  }
})
