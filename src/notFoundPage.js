import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(navigate);
  console.log(location);

  return (
    <div
      style={{
        alignItems: "center",
      }}
    >
      <img
        style={{
          alignItems: "center",
          alignSelf: "center",
        }}
        src="https://firebasestorage.googleapis.com/v0/b/meekor-7f10c.appspot.com/o/files%2Fbear404.gif?alt=media&token=732a1eac-7a08-4422-a2f9-0a9ada95f4e9"
      ></img>
    </div>
  );
};
export default NotFound;
