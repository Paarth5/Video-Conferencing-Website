const socket = io("/");
const videoGrid = document.querySelector(".videoGrid");
const myPeer = new Peer(userId, {
  host: "/",
  port: "3001",
});
const container = document.createElement("div");
const dispName = document.createElement("span");
dispName.innerText = "You";
container.append(dispName);
const myVideo = document.createElement("video");
container.classList.add("videoContainer");
dispName.classList.add("dispName");
myVideo.classList.add("videoStream");
myVideo.muted = true;
myVideo.classList.add("me");
const peers = {};
const containers = {};

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream, container);
    socket.on("user-connected", (userId, userName) => {
      console.log("user Connected", userName);
      connectToNewUser(userId, stream, userName);
    });
  });

myPeer.on("call", (call) => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      call.answer(stream);
    });
  const container = document.createElement("div");
  const dispName = document.createElement("span");
  dispName.innerText = `${call.metadata.userName}`;
  container.append(dispName);
  const video = document.createElement("video");
  container.classList.add("videoContainer");
  dispName.classList.add("dispName");
  video.classList.add("videoStream");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream, container);
  });
  call.on("close", () => {
    video.remove();
    dispName.remove();
    container.remove();
  });
});

myPeer.on("open", () => {
  socket.emit("join-room", roomId, userId, userName);
});
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
  if (containers[userId]) containers[userId].remove();
});

function connectToNewUser(userId, stream, newUserName) {
  const call = myPeer.call(userId, stream, { metadata: { userName } });
  const video = document.createElement("video");
  const container = document.createElement("div");
  const dispName = document.createElement("span");
  container.classList.add("videoContainer");
  dispName.classList.add("dispName");
  video.classList.add("videoStream");
  dispName.innerText = `${newUserName}`;
  container.append(dispName);

  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream, container);
  });
  call.on("close", () => {
    video.remove();
    dispName.remove();
    container.remove();
  });

  peers[userId] = call;
  containers[userId] = container;
}

function addVideoStream(video, stream, container) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  container.append(video);
  videoGrid.append(container);
}
