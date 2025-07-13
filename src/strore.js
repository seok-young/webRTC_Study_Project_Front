import {RoomStore} from './stores/RoomStore.js'
import { createContext, useContext } from 'react'

export const rootStore = {
    roomStore: new RoomStore(),
}

export const StoreContext = createContext(rootStore);

export const StoreProvider = StoreContext.Provider;

export const useStore = () => {
    return useContext(StoreContext);
}