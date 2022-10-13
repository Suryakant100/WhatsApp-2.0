import { Search } from "@mui/icons-material";
import { Avatar, Box, IconButton, SpeedDial, SpeedDialAction } from "@mui/material";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import SendIcon from "@mui/icons-material/Send";
import firebase from "firebase/app";
import getRecipientEmail from "../util/getRecipientEmail";
import TimeAgo from "timeago-react";
import uuid from "react-uuid";


export default function ChatScreen({ chat, messages }) {
  //   console.log(messages);
  //   const demo = uuid().slice(0, 8);
  //   console.log(demo);

  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");
  const endofMessageRef = useRef(null);
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  //   console.log(messagesSnapshot);

  const [recipientSnapShort] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat?.users, user))
  );

  console.log(recipientSnapShort);

  const showMessage = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          id={message.id}
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message
          id={message.id}
          key={message.id}
          user={message.email}
          message={message}
        />
      ));
    }
  };

  const ScrollToBottom = () => {
    endofMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
      id: uuid(),
    });

    setInput("");
    ScrollToBottom();
  };

  const recipient = recipientSnapShort?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat?.users, user);
  //   console.log(recipientEmail);
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoUrl} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInfo>
          <h3>{recipientEmail}</h3>
          {recipientSnapShort ? (
            <p>
              Last Seen :{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loadind last seen..</p>
          )}
        </HeaderInfo>
        <HeaderIcon>
          <IconButton color="inherit">
            <Search className="btn" />
          </IconButton>
          <IconButton color="inherit">
            <MoreVertIcon className="btn" />
          </IconButton>
        </HeaderIcon>
      </Header>
      <MessageContainer>
        {showMessage()}
        {/* <h2>dhavcvdhs</h2> */}
        {/* <h2>dhavcvdhs</h2>
        <h2>dhavcvdhs</h2>
        <h2>dhavcvdhs</h2> */}
        <EndOfMessage ref={endofMessageRef} />
      </MessageContainer>

      <FooterContainer>
        <IconButton color="inherit">
          <EmojiEmotionsIcon className="btn" />
        </IconButton>
        <IconButton color="inherit">
         <AttachFileIcon className="btn"/>
        </IconButton>
        <FooterForm>
          <Input
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <IconButton color="inherit">
            {!input ? (
              <KeyboardVoiceIcon className="btn" />
            ) : (
              <button
                onClick={sendMessage}
                type="submit"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <SendIcon className="btn" />
              </button>
            )}
          </IconButton>
        </FooterForm>
      </FooterContainer>
    </Container>
  );
}

const Container = styled.div``;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 11px;
  background-color: #202c33;
  height: 59px;
  align-items: center;
`;
const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    color: white;
    font-weight: 600;
    margin-bottom: 8px;
  }
  > p {
    color: #b9b9b9;
    font-size: 12px;
  }
`;
const HeaderIcon = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  min-height: 90vh;
  background-image: url("https://i.pinimg.com/originals/97/c0/07/97c00759d90d786d9b6096d274ad3e07.png");
  object-fit: cover;
  /* background-repeat: no-repeat; */
  background-attachment: fixed;
`;
const EndOfMessage = styled.div`
  margin-bottom: 30px;
`;

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #202c33;
  z-index: 100;
  position: sticky;
  bottom: 0;
`;

const FooterForm = styled.form`
  display: contents;
`;
const Input = styled.input`
  border: none;
  outline: none;
  padding: 9px 12px 11px;
  border-radius: 5px;
  margin: 5px 10px;
  background-color: #2a3942;
  border-radius: 8px;
  border: 1px solid #2a3942;
  flex: 1;
  color: white;
`;
