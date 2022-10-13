import moment from "moment/moment";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import firebase from "firebase/app";

export default function Message({ user, message, id }) {
  //   console.log(user);
  //   const batch = firestore.batch();
  const router = useRouter();
  const [userLoggedIn] = useAuthState(auth);

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciver;
  //   console.log(TypeOfMessage);

  const deleteMessage = (id) => {
    if (user === userLoggedIn.email) {
      const mess = db
        .collection("chats")
        .doc(router.query.id)
        .collection("messages")
        .where("id", "==", message.id);

      //   console.log(mess);
      mess.get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          console.log(doc.data());
          doc.ref.delete();
        });
        // return batch.commit();
      });
    }
  };
  return (
    <TypeOfMessage onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      {message.message}
      <DeleteMessage onClick={() => deleteMessage(message.id)}>
        {isHovering && user === userLoggedIn.email && (
          <DeleteIcon className="btn " />
        )}
      </DeleteMessage>
      <TimeStamp>
        {message.timestamp ? moment(message.timestamp).format("LT") : "...."}
      </TimeStamp>
    </TypeOfMessage>
  );
}

const Container = styled.div`
  color: white;
`;

const MessageElement = styled.p`
  width: fit-content;
  padding: 14px 12px 19px 18px;
  border-radius: 7.5px;
  margin: 10px;
  min-width: 60px;
  /* padding-bottom: 26px; */
  position: relative;
  color: #e9edef;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  border-top-right-radius: 0;
  background-color: #005c4b;
`;
const Reciver = styled(MessageElement)`
  text-align: left;
  border-top-left-radius: 0;
  background-color: #202c33;
`;
const TimeStamp = styled.span`
  display: inline-block;
  float: right;
  margin: 23px 0 5px 22px;
  font-size: 11px;
  color: #e9edef;
  opacity: 0.8;
`;

const DeleteMessage = styled.span`
  width: 16px !important;
  /* float: right; */
  /* margin-bottom: 36px; */
  position: relative !important;
  right: -68px !important;
  bottom: 6px !important;
`;
