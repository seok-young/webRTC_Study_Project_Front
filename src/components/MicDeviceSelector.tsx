import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface MicDeviceSelectorProps {
  disabled: boolean;
  deviceId: string;
  onDisabledChanged: (disabled: boolean) => void;
  onDeviceIdChanged: (deviceId: string) => void;
}

interface MediaDeviceInfoWithLabel extends MediaDeviceInfo {
  label: string;
}

const MicDeviceSelector: React.FC<MicDeviceSelectorProps> = ({
    disabled,
    deviceId,
    onDisabledChanged,
    onDeviceIdChanged,
}) => {
    // ✅ State 타입 명시
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [animationStarted, setAnimationStarted] = useState<boolean>(false);

  // ✅ Ref 타입 명시
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const destNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null);

    // 페이지가 클린업 될때 미디어스트림 해제
    useEffect(() => {
        return () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        };
    }, []);

  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    const constraints: MediaStreamConstraints = {
      video: false,
      audio: {
        deviceId,
        echoCancellation: false,
        noiseSuppression: true,
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((newMediaStream) => {
        if (disabled) {
          onDisabledChanged(false);
        }

        mediaStreamRef.current = newMediaStream;
        configureAudioNode();
      })
      .catch(() => {
        if (!disabled) {
          onDisabledChanged(true);
        }
      });
  }, [deviceId]);
    


    const enumerateDevices = () => {
        if (!disabled) {
        navigator.mediaDevices
            .enumerateDevices()
            .then((deviceInfos) => {
            const mics = deviceInfos.filter(
                (deviceInfo) =>
                deviceInfo.kind === "audioinput" &&
                deviceInfo.deviceId !== "default"
            );
            setDevices(mics);
            })
            .catch(() => {
            setDevices([]);
            });
        }
    };

    const handleChangeMicId = (event: SelectChangeEvent) => {
        onDeviceIdChanged(event.target.value);
    };

    const configureAudioNode = () => {
        if (audioContextRef.current && mediaStreamRef.current) {
        const audioContext = audioContextRef.current;
        const sourceNode = audioContext.createMediaStreamSource(
            mediaStreamRef.current
        );
        const analyserNode = audioContext.createAnalyser();
        const destNode = audioContext.createMediaStreamDestination();

        analyserNode.fftSize = 256;

        sourceNode.connect(analyserNode);
        analyserNode.connect(destNode);

        sourceNodeRef.current = sourceNode;
        analyserNodeRef.current = analyserNode;
        destNodeRef.current = destNode;
        }
    };


    const startAnimation = () => {
    /* 브라우저 보안 정책과 사용자 경험측면 고려했을 때, 
            사용자 인터랙션(onClick={startAnimation}) 후에 audioContext 생성이 적합
            브라우저의 자동 음성/소리 재생 차단 정책 회피할 수 있음
            리소스를 아끼고, 필요할 때만 AudioContext를 만들기 위함
            */
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;
      if (audioContext.state === "suspended") {
        audioContext
          .resume()
          .then(() => {
            configureAudioNode();
            window.requestAnimationFrame(captureAudio);
            setAnimationStarted(true);
          })
          .catch(() => {
            audioContext.close();
            audioContextRef.current = null;
            setAnimationStarted(false);
          });
      } else if (audioContext.state === "running") {
        configureAudioNode();
        window.requestAnimationFrame(captureAudio);
        setAnimationStarted(true);
      } else {
        console.log("AudioContext is not in a valid state to start animation.", audioContext.state);
      }
    };

    const captureAudio = () => {
      if (audioContextRef.current) {
        if (analyserNodeRef.current) {
          const bufferLen = analyserNodeRef.current.frequencyBinCount;
          const buffer = new Uint8Array(bufferLen);
      // 소리의 주파수별 세기를 숫자로 뽑아오는 함수
          analyserNodeRef.current.getByteFrequencyData(buffer);
          drawAudioData(buffer, bufferLen);
        } else {
          drawAudioData(null, 0);
        }

        window.requestAnimationFrame(captureAudio);
      } else {
        console.log("Animation 중지");
      }
    };


    const drawAudioData = (buffer: Uint8Array | null, bufferLen: number) => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext("2d");
        if (canvasContext) {
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.fillStyle = "#00FF00";

          if (buffer) {
            let sum = 0;
            for (let i = 0; i < bufferLen; i++) {
              sum += (buffer[i] / 256) * canvas.width;
            }
            const average = sum / bufferLen;
            canvasContext.fillRect(0, 0, average, canvas.height);
          }
        }
      }
    };

    return (
      <Stack direction="column" spacing={0} sx={{ justifyContent: "center", alignItems: "center" }}>
        <FormControl fullWidth disabled={disabled}>
          <InputLabel>마이크 장치</InputLabel>
          <Select value={deviceId} onOpen={enumerateDevices} onChange={handleChangeMicId}>
            <MenuItem value="default">기본 장치</MenuItem>
            {devices.length > 0 &&
              devices.map((device, index) => (
                <MenuItem key={`mic-devices-${index}-${device.deviceId}`} value={device.deviceId}>
                  {device.label || `마이크 ${index + 1}`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} sx={{ justifyContent: "center", alignItems: "center", width: "400px" }}>
          <canvas
            ref={canvasRef}
            width="400"
            height="16"
            style={{
              width: "300px",
              height: "16px",
              background: "transparent",
              objectFit: "contain",
            }}
          />
          <Button disabled={disabled || animationStarted} onClick={startAnimation}>
            동작 확인
          </Button>
        </Stack>
      </Stack>
    );
  };

export default MicDeviceSelector;
