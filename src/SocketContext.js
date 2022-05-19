import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io.connect('https://localhost:5000', {secure: true});

const ContextProvider = ({ children }) => {

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [room, setRoom] = useState('');
  const [peers, setPeers] = useState([]);
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    connectionRef.current = socket;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
        connectionRef.current.emit("join room", room);
        connectionRef.current.on("all users", users => {
          const peers = [];
          users.forEach(userID => {
              const peer = createPeer(userID, connectionRef.current.id, stream);
              peersRef.current.push({
                   peerID: userID,
                   peer
              })
              peers.push(peer);
          })
          setPeers(peers)
        })
        connectionRef.current.on("user joined", payload => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
              peerID: payload.callerID,
              peer
          })
          setPeers(users => [...users, peer]);
        })
        connectionRef.current.on("receiving returned signal", payload => {
          const item = peersRef.current.find( p => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        })
      });

    socket.on('me', (id) =>{
        setMe(id)
        });

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

  }, [room]);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true, 
      trickle: false,
      offerConstraints: { 
        offerToReceiveAudio: true, 
        offerToReceiveVideo: true 
      },
      stream
    });

    peer.on("signal", signal => {
      connectionRef.current.emit("sending signal", { userToSignal, callerID, signal })
    })

    return peer
  }

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      offerConstraints: { 
        offerToReceiveAudio: true, 
        offerToReceiveVideo: true 
      },
      stream
    });

    peer.on("signal", signal => {
      connectionRef.current.emit("returning signal", {signal, callerID})
    })

    peer.signal(incomingSignal)

    return peer

  }

  //only one peer each

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      room,
      setRoom,
      peers
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
