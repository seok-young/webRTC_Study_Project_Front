const TransactionTimeout = 30 * 1000;

const DefaultMessageCallback = (container) => {}


export class WebMediaClient {
    constructor(messageCallback = DefaultMessageCallback) {
        this._nextMessageId = 0;
        this._transactionMap = {};
        this._messageCallback = messageCallback;
        this.roomId = null;
        this.connected =false;
        this.client =null;
    }

    connect = (websocketUrl, roomId) => {
        return new Promise((resolve, reject) => {
            this._addTransaction('connect', resolve, reject);

            this.roomId = roomId;
            this.client = new WebSocket(websocketUrl);
            this.client.onopen = this._onOpen;
            this.client.onclose = this._onClose;
            this.client.onerror = this._onError;
            this.client.onmessage = this._onMessage;
        })
        

    }

    _onOpen = (event) => {
        const transaction = this._getTransaction('connect');
        if(transaction) {
            this.connected = true;
            transaction.resolve();
        }


    }

    _onClose = (event) => {

    }

    _onError = (event) => {

    }

    _onMessage = (event) => {

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

    _getTransaction = (key) => {
        const transaction = this._transactionMap[key];

        if(transaction) {
            delete this._transactionMap[key];
        }

        return transaction;
    }
}