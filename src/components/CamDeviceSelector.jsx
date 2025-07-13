import { FormControl, InputLabel, Menu, MenuItem, Select, Stack } from "@mui/material"
import { set } from "mobx";
import { use, useEffect, useRef, useState } from "react";

export default function CamDeviceSelector({
    disabled, deviceId,
    onDisabledChanged, onDeviceIdChanged
})
    {
        const [devices, setDevices] = useState([]);
        const mediaPlayerRef = useRef(null);
        const mediaStreamRef = useRef(null);

        // 페이지가 클린업 될때 미디어스트림 해제
        useEffect(() => {
             return () => {
                if(mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
            }
        },[]);

        useEffect(() => {
            if(mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video:{deviceId},
                audio:false,
            };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(newMediaStream => {
                    if(disabled) {
                        onDisabledChanged(false);
                    }
                    if(mediaPlayerRef.current) {
                        mediaPlayerRef.current.srcObject =newMediaStream;
                    }
                    mediaStreamRef.current = newMediaStream;
        })
                .catch(error => {
                    if(!disabled) {
                        onDisabledChanged(true);
                    }
                })


        },[deviceId]);
        // state 값에 따라 UI 변경

        const enumerateDevices =  () => {
            if(!disabled) {
                navigator.mediaDevices.enumerateDevices()
                    .then(deviceInofos => {
                        const cams = deviceInofos.filter(
                            deviceInfo => deviceInfo.kind === 'videoinput' && deviceInfo.deviceId !== 'default'
                        );
                        setDevices(cams);
                    })
                    .catch(error => {
                        setDevices([]);
                    })
            }
        }


        const handleChangeCamId = (event) => {
            onDeviceIdChanged(event.target.value);
        }

        return (
        <Stack direction='column' spacing={1} sx={{justifyContent: 'center', alignItems: 'center'}}>
            <video ref={mediaPlayerRef} autoPlay muted style={{width:'400px', height:'250px', background:'black', objectFit:'contain'}}/>
            <FormControl fullWidth disabled={disabled}>
                <InputLabel>카메라 장치</InputLabel>
                <Select value={'default'} onOpen={enumerateDevices} onChange={handleChangeCamId}>
                    <MenuItem value='default'>기본 장치</MenuItem>
                    {devices && devices.map((device, index) => (
                        <MenuItem key={`cam-devices-${index}-${device.deviceId}`} value={device.deviceId}>
                            {device.label}
                        </MenuItem>
                    ))}
                </Select>
          
            </FormControl>
        </Stack>
    );
}