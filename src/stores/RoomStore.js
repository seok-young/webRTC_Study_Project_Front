import { makeAutoObservable, set } from 'mobx'

const Status= {
    None :'none',
    Ing :'ing',
    Success :'success',
    Error :'error',
}

export class RoomStore {
    constructor() {
        this.camDisabled = true;
        this.selectedCamId = 'default';
        this.micDisabled = true;
        this.selectedMicId = 'default';

        this.roomId = null;
        this.status = Status.None;

        makeAutoObservable(this, {});
    }
    
    setCamDisabled(disabled) {
        this.camDisabled = disabled;
    }

    setSelectedCamId(deviceId) {
        this.selectedCamId = deviceId;
    }

    setMicDisabled(disabled) {
        this.micDisabled = disabled;
    }

    setSelectedMicId(deviceId) {
        this.selecteMicId = deviceId;
    }

    // getter 함수사용해서 status를 외부에 노출 시킴
    get isJoining() {
        return this.status === Status.Ing;
    }

    get isJoinSuccess(){
        return this.status === Status.Success;
    }

    join(roomId) {
        if((this.status !== Status.Ing) && (this.status !== Status.Success)) {
            this.roomId = roomId;
            this.status = Status.Ing;
        
            const dummySuccess = () => {
                this.status = Status.Success;
            }
            setTimeout(dummySuccess, 3000);
        
        }    
    }
}