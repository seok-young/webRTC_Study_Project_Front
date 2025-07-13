import { FormControl, InputLabel, Menu, MenuItem, Select, Stack } from "@mui/material"

export default function CamDeviceSelector() {
    return (
        <Stack direction='column' spacing={1} sx={{justifyContent: 'center', alignItems: 'center'}}>
            <video autoPlay muted style={{width:'400px', height:'250px', background:'black', objectFit:'contain'}}/>
            <FormControl fullWidth>
                <InputLabel>카메라 장치</InputLabel>
                <Select>
                    <MenuItem>기본 장치</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
}