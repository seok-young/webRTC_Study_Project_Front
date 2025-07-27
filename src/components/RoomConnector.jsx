import { Button, Stack, TextField } from '@mui/material'
import { set } from 'mobx';
import { useState } from 'react'


export function RoomConnector({joining, onJoin}) {
    const [roomId, setRoomId] = useState('');
    const [roomIdInvalid, setRoomIdInvalid] = useState(true);

    const validateRoomId = (roomId) => {
        const pattern = /^[a-zA-Z0-9]{6,12}$/; // 영문, 숫자 조합 6~12자
        return pattern.test(roomId);
    }

    const handleChangeRoomId = (event) => {
        const newName = event.target.value;

        setRoomId(newName);
        // 유효하지 않으면 true, 유효하면 false
        setRoomIdInvalid(!validateRoomId(newName));
    }

    const handleClickJoin = () => {
        onJoin(roomId);
    }

    return (
        <Stack direction='row' spacing={1} sx={{justifyContent:'flex-end', alignItems:'center'}}>
            <TextField label='방 이름' variant='outlined' placeholder='영문, 숫자 조합 6~12자'
                       style={{flex:1}} value={roomId} onChange={handleChangeRoomId}></TextField>
            <Button variant='contained' style={{flex:0}}
                    loading={joining} disabled={roomIdInvalid} onClick={handleClickJoin}
                    >입 장</Button>
        </Stack>
    )
}