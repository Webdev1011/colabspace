import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";
let peer: Peer;

export const initPeer = () => {
  peer = new Peer(uuidv4(), {
    // host: "peerjs-server.herokuapp.com", // You can deploy your own server too
    // secure: true,
    // port: 443,
    debug: 2,
  });

  return peer;
};

export const getPeer = () => peer;
