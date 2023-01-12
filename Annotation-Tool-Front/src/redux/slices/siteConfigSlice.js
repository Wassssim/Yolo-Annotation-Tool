import { createSlice } from '@reduxjs/toolkit'

export const siteConfigSlice = createSlice({
  name: 'siteConfig',
  initialState: {
    value: null,
    siteImageObjectURL: null,
    coordinatesCtrl: {"entry": { x1c: 0, y1c: 0, x2c: 0, y2c: 0, x1d: 0, y1d: 0, x2d: 0, y2d: 0 },
    "exit": { x1c: 0, y1c: 0, x2c: 0, y2c: 0, x1d: 0, y1d: 0, x2d: 0, y2d: 0 }},
    selectedSite: null,
    loadingSiteConfig: true,
  },
  reducers: {
    setCoordinates: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {...state, value: action.payload}
    },
    setCoordinatesCtrl: (state, action) => { 
      return {...state, coordinatesCtrl: action.payload}
    },
    setuploadedImageObjectURL: (state, action) => {
      console.log(action);
      return {...state, siteImageObjectURL: action.payload}
    },
    setSelectedSite: (state, action) => {
      return {...state, selectedSite: action.payload}
    },
    setLoadingSiteConfig: (state, action) => {
      return {...state, loadingSiteConfig: action.payload}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCoordinates, setCoordinatesCtrl, setuploadedImageObjectURL, setSelectedSite, setLoadingSiteConfig } = siteConfigSlice.actions

export const selectImageURL = (state) => state.siteConfig.siteImageObjectURL

export default siteConfigSlice.reducer