import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import * as Emailvalidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // console.log(user);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [Chatsnapshot] = useCollection(userChatRef);
  // console.log(Chatsnapshot);

  const createChat = () => {
    const input = prompt("Enter the Email");
    if (!input) return null;
    if (
      Emailvalidator.validate(input) &&
      !chatExist(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatExist = (recipientEmail) => {
    !!Chatsnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  };

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user.photoURL}
          onClick={handleClick}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}

          // onClick={() => auth.signOut()}
        />
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                left: 9,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem>
            <Avatar src={user.photoURL} /> My account
          </MenuItem>
          <Divider />

          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={() => auth.signOut()}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
        <IconContainer>
          <IconButton>
            <AutoModeIcon className="btn" />
          </IconButton>
          <IconButton color="inherit">
            <ChatIcon className="btn" />
          </IconButton>
          <IconButton color="inherit">
            <MoreVertIcon className="btn" />
          </IconButton>
        </IconContainer>
      </Header>
      <Search>
        <SearchIcon className="btn" />
        <SearchInput placeholder="Search or start new chat" />

        <FilterListIcon className="btn" style={{ flex: "end" }} />
      </Search>
      <UserContainer>
        <Button onClick={createChat}>Start a new chat</Button>

        {Chatsnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
      </UserContainer>
    </Container>
  );
}

const Container = styled.div`
  border-right: 0.5px solid #d1d7db;
  max-width: 350px;
  min-width: 300px;
`;
const Header = styled.div`
  display: flex;
  position: static;
  top: 0;
  background-color: #202c33;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 59px;

  color: white;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const IconContainer = styled.div``;
const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #111b21;
  justify-content: space-between;
  position: relative;
  top: 0;
  gap: 6px;
  z-index: 1;
`;
const SearchInput = styled.input`
  border: none;
  outline: none;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
  background-color: #202c33;
  flex: 1;
`;

const UserContainer = styled.div`
  background-color: #111b21;
  height: 82.5vh;
  overflow-x: hidden;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
