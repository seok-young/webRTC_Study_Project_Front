import { makeAutoObservable, set } from 'mobx'
import { WebMediaClient } from '../lib/WebMediaClient';

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
        this.client = null;
        this.apiUrl = null;
        this.streamUrl = null;
        this.user = null;
        this.anotherUser = null;

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


    
    *join(roomId) {
        if((this.status !== Status.Ing) && (this.status !== Status.Success)) {
            this.roomId = roomId;
            this.status = Status.Ing;
        
            const websocketUrl = 'ws://localhost:8080/webmedia-ws';
            const client = new WebMediaClient(this._onMessage);
            
            try {
                yield client.connect(websocketUrl, roomId);
                this.client = client;

                const message = yield this._sendJoinMessage();
                console.log("Join 성공", message);

                this.apiUrl = message.apiUrl;
                this.streamUrl = message.streamUrl;
                this.user = message.user;
                this.anotherUser = message.anotherUser;

                this.status = Status.Success;
            } catch(error){
                console.log("Join 실패", error);

                 if(this.client) {
                    this.client.close();
                 }

                 this.roomId = null;
                 this.client = null;
                 this.apiUrl = null;
                 this.streamUrl = null;
                 this.user = null;
                 this.anotherUser =null;

                 this.status = Status.Error;
            }
        }else{
            console.log("이미 접속 중입니다.");
        } 
    }

    _onMessage = (container) => {

    }

    *_sendJoinMessage(){
        const request = {
            roomId: this.roomId
        };

        const response = yield this.client.sendMessage(request, 'JoinRequest', true);
        if(response.type === 'JoinResponse') {
            return response.message;
        } else if (response.type === 'ErrorResponse'){
            throw new Error(`응답코드 (${response.message.errorCode})`);
        } else {
            throw new Error('응답코드 {알 수 없는 응답}');
        }
    } 
    
}