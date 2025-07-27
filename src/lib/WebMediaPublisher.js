
export function WebMediaPublisher(apiUrl, streamUrl) {
    let self = {};

    // this.publisher.publish(this.publishStream, this.roomId, this.user.userId);
    self.publish = async (stream, appId, feedId) => {
        if(self.pc) {
            self.pc.addTransceiver('audio', {direction: 'sendonly'});
            self.pc.addTransceiver('video', {direction: 'sendonly'});

            const [audioTrack] = stream.getAudioTracks();
            if(audioTrack) {
                self.pc.addTrack(audioTrack);
            }
            const [videoTrack] = stream.getVideoTracks();
            if(videoTrack) {
                self.pc.addTrack(videoTrack);
            }

            const offer = await self.pc.createOffer();
            await self.pc.setLocalDescription(offer);

            const session = await new Promise((resolve, reject) => {
                const fullApiUrl = `${self.apiUrl}/rtc/v1/publish/`;
                const fullStreamUrl = `${self.streamUrl}/${appId}/${feedId}`;
                const transactionId = Number(parseInt(new Date().getTime() * Math.random() * 100)).toString(16).slice(0, 7);

                const data = {
                    api: fullApiUrl,
                    streamurl: fullStreamUrl,
                    tid: transactionId,
                    clientip: null,
                    sdp: offer.sdp
                };
                console.log("Generated offer : ", data);

                const xhr = new XMLHttpRequest();
                // 콜백 함수 정의
                xhr.onload = () => {

                    // 응답이 완전히 오지 않았으면 아무것도 하지 않음
                    if (xhr.readyState !== xhr.DONE) return;

                    // 응답 코드가 성공(200,201)이 아니면 reject 호출
                    if (xhr.status !== 200 && xhr.status !== 201) return reject(xhr);

                    // Json 객체로
                    const answer = JSON.parse(xhr.responseText);
                    console.log("Got answer : ", answer);

                    /*
                    실패하면(answer.code가 있으면) -> reject(xhr)
                    성공하면(answer.code가 없으면) -> resolve(answer)

                    reject(xhr)/resolve(answer) -> 파라미터(xhr, answer) 전달
                    -> 호출자에게 관련 정보 전달가능
                    */
                    return answer.code ? reject(xhr) : resolve(answer);
                }

                // POST 요청 보내기
                xhr.open('POST', fullApiUrl, true);

                // 요청 헤더 설정
                xhr.setRequestHeader('Content-type', 'application/json');

                // String으로 바꿔서 요청 본문에 담아 전송
                xhr.send(JSON.stringify(data));
            });


            await self.pc.setRemoteDescription(new RTCSessionDescription({type: 'answer', sdp: session.sdp}));

            return session;
        } else {
            throw new Error("RTCPeerConnection이 없음");
        }
    }

    self.close = () => {
        /*
        같은 의미
        
        if (self.pc) {
        self.pc.close();
        }
        self.pc = null;
        */ 
        self.pc && self.pc.close();
        self.pc = null;
    }

    self.pc = new RTCPeerConnection(null);
    self.pc.onconnectionstatechange = () => {
        const state = self.pc.connectionState;
        console.log("RTCPeerConnection state changed ", state);
    }

    self.apiUrl = apiUrl;
    self.streamUrl = streamUrl;

    return self;
}