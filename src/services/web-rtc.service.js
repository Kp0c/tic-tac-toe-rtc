export class WebRtcService {
  #peerConnection = new RTCPeerConnection({
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  });
  #dataChannel = this.#peerConnection.createDataChannel('data', {
    ordered: true,
  });

  constructor() {
    this.logDebug();
    this.logChannel();
  }

  async createConnectionCode() {
    const offer = await this.#peerConnection.createOffer();
    await this.#peerConnection.setLocalDescription(offer);
  }

  async tryToJoinViaConnectionCode(connectionCode) {
    const offer = JSON.parse(atob(connectionCode));
    console.log('setting remote description', offer);
    await this.#peerConnection.setRemoteDescription(offer);

    console.log('creating answer');
    const answer = await this.#peerConnection.createAnswer();
    console.log('setting local description', answer);

    const answerCode = btoa(JSON.stringify(answer));

    console.log(answerCode);


    // copy to clipboard
    const el = document.createElement('textarea');
    el.value = answerCode;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    await this.#peerConnection.setLocalDescription(answer);
  }

  logDebug() {
    this.#peerConnection.onicecandidate = (event) => {
      if (!event.candidate) return;

      console.warn('new candidate', event.candidate);

      const connectionCode = btoa(JSON.stringify(this.#peerConnection.localDescription));
      console.log(connectionCode);

      // copy to clipboard
      const el = document.createElement('textarea');
      el.value = connectionCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    this.#peerConnection.onconnectionstatechange = (event) => {
      console.log(this.#peerConnection.connectionState);

      if (this.#peerConnection.connectionState === 'connected') {
        console.log('RTCPeerConnection is connected');
      }
    }

    this.#peerConnection.ondatachannel = (event) => {
      console.log(event);
      this.#dataChannel = event.channel;

      this.logChannel();
    }

    this.#peerConnection.onicecandidateerror = (event) => {
      console.error(event);
    }
  }

  logChannel() {
    this.#dataChannel.onopen = (event) => {
      console.log('open', event);
    }

    this.#dataChannel.onclose = (event) => {
      console.log('close', event);
    }

    this.#dataChannel.onerror = (event) => {
      console.error(event);
    }

    this.#dataChannel.onmessage = (event) => {
      console.log('msg', event);
    }
  }

  async setAnswer(answer) {
    const answerObject = JSON.parse(atob(answer));
    console.log('setting remote description', answerObject);

    await this.#peerConnection.setRemoteDescription(answerObject);
  }

  sendMessage(message) {
    this.#dataChannel.send(message);
  }
}
