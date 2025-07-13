import { observer } from 'mobx-react-lite'
import { Stack } from '@mui/material'
import { Mic } from '@mui/icons-material'
import CamDeviceSelector from './components/CamDeviceSelector'
import MicDeviceSelector from './components/MicDeviceSelector'
import { RoomConnector } from './components/RoomConnector'

function App() {
    return (
        <Stack direction={{xs: 'column', md: 'row'}} spacing ={2}
            sx={{justifyContetn:'center', alignItems:'center', minHeight: '100vh'}}>
            <Stack direction='column' spacing={2}
                sx={{justifyContent:'center', alignItems:'center', padding:'16px'}}>
                <h1>Web MediaStream Study Project</h1>
                <h1>Join the web Meeing</h1>
            </Stack>
            <Stack direction='column' spacing ={1}
                sx={{justifyContent:'center', alignItems:'stretch', width:'400px'}}>
                <CamDeviceSelector />
                <MicDeviceSelector />
                <RoomConnector />
            </Stack>
        </Stack>
    )
}

export default observer(App);