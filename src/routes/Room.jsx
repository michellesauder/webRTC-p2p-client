import React, { useContext, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import Notifications from '../components/Notifications';
import Options from '../components/Options';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { SocketContext } from '../SocketContext';
import styled from "styled-components";

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Room = () => {
  const { myVideo, peers, setRoom } = useContext(SocketContext);
  const { roomID } = useParams();

  const Video = ({ peer }) => {
    const ref = useRef();

    useEffect(() => {
        setRoom(roomID);
        peer.on("stream", (stream) => {
            ref.current.srcObject = stream;
        })
    }, [peer]);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

  return ( <>
      <AppBar position='static' color="inherit">
          <Typography variant='h2' align='center'>
              Video Chat
          </Typography>
        </AppBar>
        <div>
            <video muted ref={myVideo} autoPlay playsInline />
              {peers.map((peer, index) => {
                  return (
                      <Video key={index} peer={peer} />
                  );
              })}
        </div>
  </>
  )
}

export default Room