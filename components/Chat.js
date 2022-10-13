import { Avatar } from "@mui/material";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../util/getRecipientEmail";
import { useRouter } from "next/router";

export default function Chat({ id, users }) {
  //   console.log(id, users);
  const router = useRouter();
  const [user] = useAuthState(auth);
  //   console.log(user);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

//   console.log(recipientSnapshot);

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };
  const recipient = recipientSnapshot?.docs?.[0]?.data();
//   console.log(recipient);
  const recipientEmail = getRecipientEmail(users, user);

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoUrl} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}

      <p>{recipientEmail}</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  word-break: break-word;
  /* height: 82.5vh; */
  > p {
    color: white;
    opacity: 0.8;
  }
  :hover {
    background-color: rgba(32, 44, 51, 1);
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
