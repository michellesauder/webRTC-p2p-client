import React, {useContext} from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { SocketContext } from '../SocketContext';

const VideoPlayer = () => {
    const { name, callAccepted, myVideo, userVideo, call } = useContext(SocketContext);
    return (
      <Grid container style={{display: 'flex', justifysContent: 'center'}}>
          <Paper>
            <Grid item xs={12} md={6} >
              <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
              <video playsInline muted ref={myVideo} autoPlay style={{width: '550px'}}/>
            </Grid>
          </Paper>
        {callAccepted && ( <Paper>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
              <video playsInline ref={userVideo} autoPlay style={{width: '550px'}}/>
            </Grid>
          </Paper>
            )}
      </Grid>
    );
  };

export default VideoPlayer