import React, { useEffect, useState } from "react";
import { useLiff } from "react-liff";
import "./style.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

const App = () => {
  // const [message, setMessage] = useState("");
  // const [profile, setProfile] = useState({});
  // const [context, setContext] = useState({});
  const { error, liff, isLoggedIn, ready } = useLiff();

  useEffect(() => {
    if (!isLoggedIn) return;
    liff.ready.then(() => {
      if (liff.isInClient()) {
        liff.getProfile().then((profile) => {
          console.log(profile);
          // setProfile(profile);
        });
      }
    });
    liff
      .init({
        liffId: "1657560711-7MgLg4Ld",
      })
      .then(() => {
        console.log("LIFF init succeeded.");
        // setMessage("LIFF init succeeded.");
      })
      .catch((e) => {
        console.log("LIFF init failed.");
        // setMessage("LIFF init failed.");
      });
    // console.log(message);
  }, [liff, isLoggedIn]);

  return (
    <div className="App">
      {/* <p>{message}</p> */}
      {/* <p>{JSON.stringify(profile)}</p> */}
      {/* <FirstPage /> */}
      {/*<SecondPage/>*/}
      {/* <AddMemberPage /> */}
      {/* <SummaryPage/> */}
      {/* <Link to="/add_member"> add</Link> */}
    </div>
  );
};

export default App;
