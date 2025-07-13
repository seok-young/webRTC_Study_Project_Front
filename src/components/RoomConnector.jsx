import { Button, Stack, TextField } from '@mui/material'

export function RoomConnector() {
    return (
        <Stack direction='row' spacing={1} sx={{justifyContent:'flex-end', alignItems:'center'}}>
            <TextField label='방 이름' variant='outlined' placeholder='영문, 숫자 조합 6~12자'
                       style={{flex:1}}></TextField>
            <Button variant='contained' style={{flex:0}}>입 장</Button>
        </Stack>
    )
}