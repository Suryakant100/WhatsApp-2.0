import React from "react";
import { FadingCircle } from "better-react-spinkit";

export default function Loading() {
  return (
    <center className="loading">
      <div>
        <img
          src="https://www.freeiconspng.com/thumbs/logo-whatsapp-png/free-logo-whatsapp-pictures-24.png"
          alt=""
          style={{ marginBottom: 10 }}
          height={200}
        />
        <FadingCircle size={50} color="#3cbc38" />
      </div>
    </center>
  );
}