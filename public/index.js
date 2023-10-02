const SimplePeer = require("simple-peer");
const socket = io("/");

const peer = new SimplePeer({
  initiator: location.hash === "#1",
  trickle: false,
});
peer.on("connect", () => {
  console.log("COnnected");
});
const videoGrid = document.querySelector(".videoGrid");
socket.emit("join-room", roomId, userId);
socket.on("user-connected", (userId) => {
  console.log("User Connected", userId);
});
