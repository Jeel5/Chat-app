import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Modal,
  Box,
} from '@mui/material';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FriendRequestsComponent from '../components/friendrequest'; // Corrected import path
import FriendsList from '../components/friendlist'; // Corrected import path
import ChatArea from '../components/chatcontainer'; // Corrected import path
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import Cookies from 'js-cookie';

const socket = io('http://localhost:3100');

const Main = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    const user = Cookies.get('token');
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  useEffect(() => {
    socket.on('friendRequestReceived', (data) => {
      setPendingRequests((prev) => [...prev, data.sender]);
      toast.info(`New friend request from ${data.sender}`);
    });

    socket.on('friendRequestAccepted', (data) => {
      setFriends((prev) => [...prev, data.friend]);
      toast.success(`${data.friend} is now your friend!`);
    });

    return () => {
      socket.off('friendRequestReceived');
      socket.off('friendRequestAccepted');
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedRequests = JSON.parse(localStorage.getItem('pendingRequests')) || [];
      setPendingRequests(storedRequests);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleToggleFriendRequests = () => {
    setShowFriendRequests(!showFriendRequests);
  };

  const handleAcceptFriend = (user) => {
    socket.emit('acceptFriendRequest', { sender: loggedInUser, recipient: user });
    const updatedRequests = pendingRequests.filter((request) => request !== user);
    setPendingRequests(updatedRequests);
  };

  const handleDeclineFriend = (user) => {
    toast.error(`Friend request from ${user} declined.`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="flex-1">
            Chat App
          </Typography>
          <div className="flex items-center">
            <IconButton color="inherit">
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <IconButton color="inherit" onClick={handleToggleFriendRequests}>
              <Badge badgeContent={pendingRequests.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <div className="flex flex-1 overflow-hidden">
        <FriendsList
          friends={friends}
          setFriends={setFriends}
          setSelectedFriend={setSelectedFriend}
          loggedInUser={loggedInUser}
          pendingRequests={pendingRequests}
          setPendingRequests={setPendingRequests}
        />
        <ChatArea selectedFriend={selectedFriend} />
        <Modal
          open={showFriendRequests}
          onClose={handleToggleFriendRequests}
          aria-labelledby="friend-requests-modal-title"
          aria-describedby="friend-requests-modal-description"
        >
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <FriendRequestsComponent
              pendingRequests={pendingRequests}
              handleAcceptFriend={handleAcceptFriend}
              handleDeclineFriend={handleDeclineFriend}
            />
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Main;
