const socket = io();
const myPeer = new Peer(userID, {
  host: "/",
  port: 3001,
});

let s = 0;
// Video wala part
const videoGrid = document.querySelector(".videoGrid");
const myVideo = document.createElement("video");
myVideo.classList.add("me");
myVideo.muted = true;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    s = stream;
    addVideoStream(myVideo, stream);
  });
myPeer.on("open", () => {
  socket.emit("join-room", roomID, userID);
});
myPeer.on("call", (call) => {
  call.answer(s);
  const userVideo = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(userVideo, userVideoStream);
  });
});
socket.on("user-connected", (userID) => {
  console.log("user Connected", userID);
  connectToNewUser(userID, s);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const userVideo1 = document.createElement("video");
  call.on("stream", (userVideoStream1) => {
    addVideoStream(userVideo1, userVideoStream1);
  });
  call.on("close", () => {
    video.remove();
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
