import { configureStore } from '@reduxjs/toolkit'
import siteConfigReducer from './slices/siteConfigSlice'
import annotationReducer from './slices/annotationSlice'


export default configureStore({
  reducer: {
    siteConfig: siteConfigReducer,
    annotationTool: annotationReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
})