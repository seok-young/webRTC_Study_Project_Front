
const TransactionTimeout = 30 * 1000; // 30초
const DefaultMessageCallback = (container) => {}

export class WebMediaClient {
    constructor(messageCallback = DefaultMessageCallback) {
        this._nextMessageId = 0;
        this._transactionMap = {};
        this._messageCallback = messageCallback;

        this.roomId = null;
        this.connected = false;
        this.client = null; // 웹소켓 객체
    }

    /*
     이벤트 핸들러 말고 promise 사용해서 구현
     이벤트 핸들러 쓰게 되면 요청 전송, 응답 수신이 분리되어 코드 작성이 어려움
     한번에 작성하기 위해서 promise 사용

     무언가의 응답이 아닌 서버에서 이벤트발생으로 보내는 메세지 수신은 이벤트 핸들러 사용
    */
    connect = (websocketUrl, roomId) => {
        return new Promise((resolve, reject) => {
            this._addTransaction('connect', resolve, reject);

            this.roomId = roomId;
            this.client = new WebSocket(websocketUrl);     // 웹소켓 연결 시도
            this.client.onopen = this._onOpen;             // 연결 성공 시 _onOpen 실행
            this.client.onclose = this._onClose;
            this.client.onerror = this._onError;
            this.client.onmessage = this._onMessage;       // 메세지 받으면 _onMessage 실행
        });
    }

    sendMessage = (message, type, isTransaction) => {
        return new Promise((resolve, reject) => {
            if(this.connected) {
                const messageId = String(this._nextMessageId++);
                const request = {
                    roomId: this.roomId,
                    from: 'client',
                    to: 'webmedia-ws',
                    type: type,
                    messageId: messageId,
                    message: message,
                };

                // _addTransaction은 반드시 send보다 먼저 실행
                if(isTransaction) {
                    this._addTransaction(messageId, resolve, reject);
                }

                // 스트링으로 변환해서 전송
                this.client.send(JSON.stringify(request));

                if(!isTransaction) {
                    resolve();
                }
            } else {
                reject(new Error("접속 중이 아닙니다"));
            }
        });
    }

    close = () => {
        this.connected = false;
        if(this.client) {
            this.client.close();
            this.client = null;
        }
    }

    _onOpen = (event) => {
        const transaction = this._getTransaction('connect');
        if(transaction) {
            this.connected = true;
            transaction.resolve(); // Promise '실행완료(성공) 처리'
        }
    }

    _onClose = (event) => {
        console.log("WebSocket onClose", event);
    }

    _onError = (event) => {
        console.log("WebSocket onError", event);
    }

    _onMessage = (event) => {
        if(event.data) {
            // Json 객체로 
            const container = JSON.parse(event.data);
            const transaction = this._getTransaction(container.messageId);
            if(transaction) {
                transaction.resolve(container);
            } else {
                this._messageCallback(container);
            }
        }
    }

    _addTransaction = (key, resolve, reject) => {
        this._transactionMap[key] = {resolve, reject};

        setTimeout(() => {
            const transaction = this._transactionMap[key];
            if(transaction) {
                delete this._transactionMap[key];

                transaction.reject(new Error("Transaction 시간 초과"));
            }
        }, TransactionTimeout);
    }

    // 해당 트랜잭션을 꺼내면서 Transaction Map에서 제거
    _getTransaction = (key) => {
        const transaction = this._transactionMap[key];

        if(transaction) {
            delete this._transactionMap[key];
        }

        return transaction;
    }
}