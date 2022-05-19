import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { v1 as uuid } from "uuid";
import { Box, Button, Container, Paper } from '@mui/material';
import { SocketContext } from '../SocketContext';

const CreateRoom = () => {
const { setRoom } = useContext(SocketContext);

  let navigate = useNavigate();
    const create = () => {
        const id = uuid();
        navigate(`/room/${id}`);
        setRoom(id);
    }

    return (
        <Container maxWidth="md" fixed>
            <Paper elevation={0} variant="outlined" square>
                <Box sx={{
                        width: '100%',
                        height: 300,
                        backgroundColor: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems:'center',
                    }}
                    >
                    <Button onClick={create} variant="outlined" sx={{maxHeight:50}}>Create room</Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateRoom;
