import { FormControl, InputLabel, Menu, MenuItem, Select, Stack, Button } from "@mui/material"

export default function CamDeviceSelector() {
    return(
        <Stack direction='column' spacing={0} sx={{justifyContent: 'center', alignItems: 'center'}}>
            <FormControl fullWidth>
                <InputLabel>마이크 장치</InputLabel>
                <Select>
                    <MenuItem>기본 장치</MenuItem>
                </Select>
            </FormControl>

            <Stack direction='row' spacing={1} sx={{justifyContent: 'center', alignItems: 'center', width: '400px'}}>
                <canvas width='400' height='16' style={{width: '300px', height:'16', background: 'transparent', objectFit: 'contain'}}/>
                <Button>동작 확인</Button>

            </Stack>
        </Stack>
    )
}
