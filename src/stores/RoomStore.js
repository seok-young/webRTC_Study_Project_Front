import { makeAutoObservable } from 'mobx'

export class RoomStore {
    constructor() {
        this.camDisabled = true;
        this.selectedCamId = 'default';
        this.micDisabled = true;
        this.selectedMicId = 'default';

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
}