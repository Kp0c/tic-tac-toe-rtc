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

  #isDataChannelOpen = false;

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

  /**
   * Fires when error happened
   * @type {Observable}
   */
  errors$ = new Observable();

  /**
   * Fires when a message received from another peer
   * @type {Observable}
   */
  messages$ = new Observable();

  constructor() {
    this.connectionMessages();
    this.channelMessages();
  }

  async startHost() {
    const offer = await this.#peerConnection.createOffer();
    await this.#peerConnection.setLocalDescription(offer);
  }

  async joinViaConnectionCode(connectionCode) {
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

  connectionMessages() {
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
      this.#dataChannel = event.channel;

      this.channelMessages();
    }

    this.#peerConnection.onicecandidateerror = (event) => {
      this.errors$.next(event);
    }
  }

  channelMessages() {
    this.#dataChannel.onopen = (event) => {
      this.#isDataChannelOpen = true;
    }

    this.#dataChannel.onclose = (event) => {
      this.#isDataChannelOpen = false;
    }

    this.#dataChannel.onerror = (event) => {
      this.errors$.next(event);
    }

    this.#dataChannel.onmessage = (event) => {
      this.messages$.next(JSON.parse(event.data));
    }
  }

  async setAnswer(answer) {
    const answerObject = JSON.parse(atob(answer));
    console.log('setting remote description', answerObject);

    await this.#peerConnection.setRemoteDescription(answerObject);
  }

  sendMessage(message, retry = true) {
    // retry sending message if data channel is not open yet (only once)
    if (!this.#isDataChannelOpen) {
      setTimeout(() => {
        this.sendMessage(message, false);
      }, 100);
      return;
    }

    if (!this.#isDataChannelOpen) {
      this.errors$.next('Data channel is not open');
      return;
    }

    this.#dataChannel.send(JSON.stringify(message));
  }
}
