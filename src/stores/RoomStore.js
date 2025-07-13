import { makeAutoObservable } from 'mobx'

export class RoomStore {
    constructor() {
        this.camDisabled = true;
        this.selectedCamId = 'default';

        makeAutoObservable(this, {});
    }
    setCamDisabled(disabled) {
        this.camDisabled = disabled;
    }

    setSelectedCamId(deviceId) {
        this.selectedCamId = deviceId;
    }
}