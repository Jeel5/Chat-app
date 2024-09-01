import React, { useState, useEffect } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faClock,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const socket = io("http://localhost:3100");

const FriendsList = ({
  friends,
  setFriends,
  pendingRequests,
  setPendingRequests,
  setSelectedFriend,
  loggedInUser,
}) => {
  const [friendSearchTerm, setFriendSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await axios.get(
          `http://localhost:3100/users/search?searchTerm=${userSearchTerm}`,
          { withCredentials: true }
        );
        setFilteredUsers(response.data || []);
        setLoadingUsers(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoadingUsers(false);
      }
    };

    if (userSearchTerm) {
      fetchUsers();
    } else {
      setFilteredUsers([]);
    }
  }, [userSearchTerm]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserSearch = (value) => {
    setUserSearchTerm(value);
  };

  const handleSeeMore = () => {
    alert("See more clicked");
  };

  const handleAddFriend = (username) => {
    const decodedToken = jwtDecode(loggedInUser);
    const senderUsername = decodedToken.username;
    socket.emit("friendRequest", { sender: senderUsername, recipient: username});
    toast.success(`Friend request sent to ${username}`);
  };

  useEffect(() => {
    socket.on("friendRequestReceived", (data) => {
      console.log("Friend request received:", data);
      if (data.recipient === loggedInUser.username) {
        setPendingRequests((prev) => [...prev, data.sender]);
        toast.info(`New friend request from ${data.sender}`);
      }
    });

    socket.on("friendRequestAccepted", (data) => {
      if (data.recipient === loggedInUser.username) {
        setFriends((prev) => [...prev, data.sender]);
        toast.success(`${data.sender} is now your friend!`);
      }
    });

    return () => {
      socket.off("friendRequestReceived");
      socket.off("friendRequestAccepted");
    };
  }, [pendingRequests, friends, loggedInUser]);

  const filteredFriends = friends.filter((friend) =>
    friend.toLowerCase().includes(friendSearchTerm.toLowerCase())
  );

  return (
    <aside className="w-1/4 bg-gray-200 p-4 overflow-auto">
      <div className="flex items-center justify-between my-2">
        <Typography variant="h6">Friends</Typography>
        <IconButton
          color="primary"
          title="Add friend"
          onClick={handleMenuClick}
        >
          <AddIcon />
        </IconButton>
      </div>
      <div className="my-2">
        <TextField
          variant="outlined"
          placeholder="Search friends"
          value={friendSearchTerm}
          onChange={(e) => setFriendSearchTerm(e.target.value)}
          size="small"
          fullWidth
        />
      </div>
      <List>
        {filteredFriends.map((name, index) => (
          <ListItemButton key={index} onClick={() => setSelectedFriend(name)}>
            <Avatar>{name.charAt(0)}</Avatar>
            <ListItemText primary={name} className="ml-2" />
          </ListItemButton>
        ))}
      </List>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: "80vh",
              width: "15rem",
            },
          },
        }}
      >
        <div className="p-4">
          <TextField
            variant="outlined"
            placeholder="Search users"
            value={userSearchTerm}
            onChange={(e) => handleUserSearch(e.target.value)}
            fullWidth
            size="small"
            autoFocus
          />
        </div>
        {loadingUsers ? (
          <div className="flex items-center justify-center p-4">
            <CircularProgress />
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers
                .slice(0, showSeeMore ? filteredUsers.length : 10)
                .map((user, index) => (
                  <MenuItem key={index}>
                    <ListItemText primary={user.username} />
                    <IconButton onClick={() => handleAddFriend(user.username)}>
                      {pendingRequests &&
                      pendingRequests.includes(user.username) ? (
                        <FontAwesomeIcon icon={faClock} />
                      ) : (
                        <FontAwesomeIcon icon={faUserPlus} />
                      )}
                    </IconButton>
                  </MenuItem>
                ))
            ) : (
              <MenuItem disabled>
                <ListItemText primary="No results found" />
              </MenuItem>
            )}

            {filteredUsers && filteredUsers.length > 20 && (
              <MenuItem
                onClick={handleSeeMore}
                className="flex items-center flex-col bg-gray-700 text-white rounded-md py-2 hover:bg-gray-600"
              >
                <ListItemText primary="See more" className="text-center" />
                <FontAwesomeIcon
                  icon={faArrowDown}
                  className="text-blue-500 mt-2 ml-2"
                />
              </MenuItem>
            )}
          </div>
        )}
      </Menu>
    </aside>
  );
};

export default FriendsList;
