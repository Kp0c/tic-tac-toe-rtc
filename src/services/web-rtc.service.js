import { Observable } from '../helpers/observable.js';

/**
 * A class that provides WebRTC functionality for hosting and joining peer-to-peer connections.
 */
export class WebRtcService {
  /**
   * Peer connection
   * @type {RTCPeerConnection}
   */
  #peerConnection = new RTCPeerConnection({
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  });

  /**
   * Data channel
   * @type {RTCDataChannel}
   */
  #dataChannel = this.#peerConnection.createDataChannel('data', {
    ordered: true,
  });

  /**
   * Is data channel open
   *
   * @type {boolean}
   */
  #isDataChannelOpen = false;

  /**
   * Host/Answer codes
   * @type {Observable<string>}
   */
  code$ = new Observable();

  /**
   * Fires when connection state changed
   *
   * @type {Observable<string>}
   */
  connectionState$ = new Observable();

  /**
   * Fires when error happened
   * @type {Observable<string|Error>}
   */
  errors$ = new Observable();

  /**
   * Fires when a message received from another peer
   * @type {Observable<Object>}
   */
  messages$ = new Observable();

  constructor() {
    this.#connectionMessages();
    this.#channelMessages();
  }

  /**
   * Starts hosting a peer-to-peer connection
   * @returns {Promise<void>}
   */
  async startHost() {
    const offer = await this.#peerConnection.createOffer();
    await this.#peerConnection.setLocalDescription(offer);
  }

  /**
   * Joins a peer-to-peer connection via the connection code provided by the host.
   * Generates an answer code that should be sent to the host.
   *
   * @param {string} connectionCode
   * @returns {Promise<void>}
   */
  async joinViaConnectionCode(connectionCode) {
    const offer = JSON.parse(atob(connectionCode));
    await this.#peerConnection.setRemoteDescription(offer);

    const answer = await this.#peerConnection.createAnswer();

    await this.#peerConnection.setLocalDescription(answer);

    const answerCode = btoa(JSON.stringify(answer));
    this.code$.next(answerCode);
  }

  /**
   * Sets the answer code provided by the guest.
   *
   * @param {string} answer
   * @returns {Promise<void>}
   */
  async setAnswer(answer) {
    const answerObject = JSON.parse(atob(answer));

    await this.#peerConnection.setRemoteDescription(answerObject);
  }

  /**
   * Sends a message to another peer.
   * Retries sending the message if the data channel is not open yet.
   *
   * @param {Object} message - message to send
   * @param {boolean} [retry] - whether to retry sending the message if the data channel is not open yet
   */
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

  /**
   * Closes the peer-to-peer connection.
   */
  close() {
    this.#peerConnection.close();

    this.#dataChannel.close();
  }

  /**
   * Sets up connection messages handlers
   */
  #connectionMessages() {
    this.#peerConnection.onicecandidate = (event) => {
      if (!event.candidate) return;

      const connectionCode = btoa(JSON.stringify(this.#peerConnection.localDescription));
      this.code$.next(connectionCode);
    }

    this.#peerConnection.onconnectionstatechange = (event) => {
      this.connectionState$.next(this.#peerConnection.connectionState);
    }

    this.#peerConnection.ondatachannel = (event) => {
      this.#dataChannel = event.channel;

      this.#channelMessages();
    }

    this.#peerConnection.onicecandidateerror = (event) => {
      // ignore RTCPeerConnectionIceErrorEvent events
      if (event instanceof RTCPeerConnectionIceErrorEvent) {
        return;
      }
      this.errors$.next(event);
    }
  }

  /**
   * Sets up data channel messages handlers
   */
  #channelMessages() {
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
}
