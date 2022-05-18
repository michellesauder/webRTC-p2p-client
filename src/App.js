import React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";

import VideoPlayer from './components/VideoPlayer';
import Notifications from './components/Notifications';
import Options from './components/Options';

const App = () => {
  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<CreateRoom/>} />
            <Route path="/room/:roomID" element={<Room />} />
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App