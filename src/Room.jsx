import {observer} from 'mobx-react-lite'
import { IconButton, Stack } from '@mui/material'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

function Room() {
    return (
        <div style={{position:'relative', width:'100%', height:'100vh'}}>
            <video autoPlay muted
                    style={{position:'absoulte', 
                            left:'0px', top:'0px', width:'100%', height:'100%',
                            background: 'black', objectFit:'contain'}}/>
            <video autoPlay muted
                    style={{position:'absolute',
                            right:'24px', bottom:'24px', width:'35%', height:'35%',
                            background: 'transparent', objectFit:'contain'}}/>
            <Stack direction='row' spacing={1}
                   sx={{justifyContent:'flex-end', alignItems:'center',
                        position:'absolute', top:'16px', right:'16px'}}>
                <IconButton style={{color:'red'}}>
                    <VolumeUpIcon />
                </IconButton>

                <IconButton style={{color:'lightgrey'}}>
                    <ExitToAppIcon />
                </IconButton>
            </Stack>
        </div>
    );
}

export default observer(Room);