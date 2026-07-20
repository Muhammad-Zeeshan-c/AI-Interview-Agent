import {configureStore} from '@reduxjs/toolkit'
import userSlice from './userSlice/userSlice.js'

export default configureStore({
    reducer:{
        user:userSlice
    }
})