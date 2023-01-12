import { createSlice } from '@reduxjs/toolkit'

export const annotationSlice = createSlice({
  name: 'annotation',
  initialState: {
    selectedImageId: null,
    loadingCanvasBg: true,
    shapes: [],
    images: [],
  },
  reducers: {
    setSelectedImageId: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {...state, selectedImageId: action.payload}
    },
    setLoadingCanvasBg: (state, action) => {
        return {...state, loadingCanvasBg: action.payload}
    },
    setShapes(state, action) {
        return {...state, shapes: action.payload}
    },
    setImagesList(state, action) {
        return {...state, images: action.payload}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setSelectedImageId, setLoadingCanvasBg, setShapes, setImagesList } = annotationSlice.actions

//export const selectImageURL = (state) => state.siteConfig.siteImageObjectURL

export default annotationSlice.reducer