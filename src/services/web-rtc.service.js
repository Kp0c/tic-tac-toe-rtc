import { Observable } from '../helpers/observable.js';

export class WebRtcService {
  #peerConnection = new RTCPeerConnection({
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  });

  #dataChannel = this.#peerConnection.createDataChannel('data', {
    ordered: true,
  });

  /**
   * Host/Answer codes
   * @type {Observable}
   */
  code$ = new Observable();

  /**
   *
   * @type {Observable}
   */
  connectionState$ = new Observable();

  constructor() {
    this.logDebug();
    this.logChannel();
  }

  async startHost() {
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

    await this.#peerConnection.setLocalDescription(answer);

    const answerCode = btoa(JSON.stringify(answer));
    this.code$.next(answerCode);
  }

  logDebug() {
    this.#peerConnection.onicecandidate = (event) => {
      if (!event.candidate) return;

      console.warn('new candidate', event.candidate);

      const connectionCode = btoa(JSON.stringify(this.#peerConnection.localDescription));
      this.code$.next(connectionCode);
    }

    this.#peerConnection.onconnectionstatechange = (event) => {
      this.connectionState$.next(this.#peerConnection.connectionState);
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
