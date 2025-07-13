import { makeAutoObservable } from 'mobx'

export class RoomStore {
    constructor() {
        makeAutoObservable(this, {});
    }
}