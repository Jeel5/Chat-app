import React, { useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  Divider,
  TextField,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatArea = ({ selectedFriend }) => {
  const [chats, setChats] = useState(['Hello!', 'Hi there!', 'How are you?']);

  return (
    <main className="flex-1 flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <Typography variant="h6">
          {selectedFriend ? selectedFriend : 'Select a friend to chat'}
        </Typography>
      </div>
      {selectedFriend ? (
        <>
          <Divider />
          <div className="flex-1 p-4 overflow-auto">
            <List className="space-y-4">
              {chats.map((text, index) => (
                <ListItem key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-2 rounded-lg ${index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'}`}>
                    <Typography variant="body1">{text}</Typography>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
          <Divider />
          <div className="p-4 flex items-center">
            <TextField
              variant="outlined"
              placeholder="Type a message"
              className="flex-1"
              size="small"
            />
            <IconButton color="primary" className="ml-2">
              <SendIcon />
            </IconButton>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <Typography variant="h6">Select a friend to chat</Typography>
        </div>
      )}
    </main>
  );
};

export default ChatArea;
