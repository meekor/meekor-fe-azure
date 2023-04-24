import React, { useState, useEffect } from "react";
//import * as successData from "./success.json";

const Loading = () => {
  const mystyle = {
    //alignItems: "center",
    //height: "100%",
    textAlign: "center",
    fontSize: "40px",
  };
  // <Lottie options={defaultOptions} height={300} width={300} />

  return (
    <div className="h-screen w-screen ">
      <div style={mystyle}>
        <img
          style={{
            alignItems: "center",
            alignSelf: "center",
          }}
          src="https://firebasestorage.googleapis.com/v0/b/meekor-7f10c.appspot.com/o/files%2Floading.gif?alt=media&token=b126c54d-bcd1-4ab5-9c69-72ba84072771"
        ></img>
        <h1 className="font-semibold text-3xl">Loading</h1>
      </div>
    </div>
  );
};

export default Loading;
