import React, { useContext } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import Notifications from '../components/Notifications';
import Options from '../components/Options';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { SocketContext } from '../SocketContext';

const Room = () => {
  const { name, callAccepted, myVideo, userVideo, call } = useContext(SocketContext);
  console.log({name})
  return ( <>
      <AppBar position='static' color="inherit">
          <Typography variant='h2' align='center'>
              Video Chat
          </Typography>
        </AppBar>
        <VideoPlayer/>
        <Options>
            <Notifications/>
        </Options>
  </>
  )
}

export default Room