'use client'

import { persistor, store } from '@/store/store'

import Loading from './Loading'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import React from 'react'

const GlobalProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={<Loading />}>
                {children}
            </PersistGate>
        </Provider>
    )
}

export default GlobalProvider