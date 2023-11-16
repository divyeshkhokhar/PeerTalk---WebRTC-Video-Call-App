const webSocket = new WebSocket("ws://127.0.0.1:3000");
let localStream;
let peerConn;
let username;
let isAudio = true;
let isVideo = true;

webSocket.onmessage = (event) => {
  handleSignallingData(JSON.parse(event.data));
};

function handleSignallingData(data) {
  switch (data.type) {
    case "offer":
      peerConn.setRemoteDescription(data.offer);
      createAndSendAnswer();
      break;
    case "answer":
      peerConn.setRemoteDescription(data.answer);
      break;
    case "candidate":
      peerConn.addIceCandidate(data.candidate);
      break;
  }
}

function sendData(data) {
  data.username = username;
  webSocket.send(JSON.stringify(data));
}

function createAndSendOffer() {
  peerConn
    .createOffer()
    .then((offer) => {
      return peerConn.setLocalDescription(offer);
    })
    .then(() => {
      sendData({
        type: "store_offer",
        offer: peerConn.localDescription,
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function createAndSendAnswer() {
  peerConn
    .createAnswer()
    .then((answer) => {
      return peerConn.setLocalDescription(answer);
    })
    .then(() => {
      sendData({
        type: "send_answer",
        answer: peerConn.localDescription,
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function toggleMedia(elementId, isVideoType) {
  const mediaButton = document.getElementById(elementId);

  if (isVideoType) {
    isVideo = !isVideo;
    localStream.getVideoTracks()[0].enabled = isVideo;
    mediaButton.innerText = isVideo ? "Pause Video" : "Start Video";
  } else {
    isAudio = !isAudio;
    localStream.getAudioTracks()[0].enabled = isAudio;
    mediaButton.innerText = isAudio ? "Mute Audio" : "Start Audio";
  }
}

function sendUsername() {
  username = document.getElementById("username-input").value;
  sendData({
    type: "store_user",
  });
}

function startCall() {
  document.getElementById("video-call-div").style.display = "inline";

  navigator.mediaDevices
    .getUserMedia({
      video: {
        frameRate: 24,
        width: { min: 480, ideal: 720, max: 1280 },
        aspectRatio: 1.33333,
      },
      audio: true,
    })
    .then((stream) => {
      localStream = stream;
      document.getElementById("local-video").srcObject = localStream;

      let configuration = {
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
            ],
          },
        ],
      };

      peerConn = new RTCPeerConnection(configuration);
      localStream
        .getTracks()
        .forEach((track) => peerConn.addTrack(track, localStream));

      peerConn.ontrack = (e) => {
        document.getElementById("remote-video").srcObject = e.streams[0];
      };

      peerConn.onicecandidate = (e) => {
        if (e.candidate == null) return;
        sendData({
          type: "store_candidate",
          candidate: e.candidate,
        });
      };

      createAndSendOffer();
    })
    .catch((error) => {
      console.error(error);
    });
}

function joinCall() {
  username = document.getElementById("username-input").value;
  document.getElementById("video-call-div").style.display = "inline";

  navigator.mediaDevices
    .getUserMedia({
      video: {
        frameRate: 24,
        width: { min: 480, ideal: 720, max: 1280 },
        aspectRatio: 1.33333,
      },
      audio: true,
    })
    .then((stream) => {
      localStream = stream;
      document.getElementById("local-video").srcObject = localStream;

      let configuration = {
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
            ],
          },
        ],
      };

      peerConn = new RTCPeerConnection(configuration);
      localStream
        .getTracks()
        .forEach((track) => peerConn.addTrack(track, localStream));

      peerConn.ontrack = (e) => {
        document.getElementById("remote-video").srcObject = e.streams[0];
      };

      peerConn.onicecandidate = (e) => {
        if (e.candidate == null) return;

        sendData({
          type: "send_candidate",
          candidate: e.candidate,
        });
      };

      sendData({
        type: "join_call",
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
