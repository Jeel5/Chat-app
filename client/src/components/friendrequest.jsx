import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client';

const socket = io('http://localhost:3100'); // Update with your server URL

const FriendRequestsComponent = ({
  pendingRequests,
  handleAcceptFriend,
  handleDeclineFriend,
}) => {

  return (
    <div>
      <Typography variant="h6" id="friend-requests-modal-title">
        Friend Requests
      </Typography>
      <List>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>{req.sender ? req.sender.charAt(0) : '?'}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={req.sender || 'Unknown'}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      wants to add you as a friend
                    </Typography>
                  </>
                }
              />
              <IconButton
                edge="end"
                aria-label="accept"
                onClick={() => handleAcceptFriend(req.sender)}
                style={{ color: 'green', marginRight: '2vw' }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="decline"
                onClick={() => handleDeclineFriend(req.sender)}
                style={{ color: 'red' }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </IconButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No friend requests" />
          </ListItem>
        )}
      </List>
    </div>
  );
};

export default FriendRequestsComponent;
