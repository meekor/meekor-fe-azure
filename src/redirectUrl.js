import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLiff } from "react-liff";
import Loading from "./loading.js";

const RedirectUrl = () => {
  const { error, liff, isLoggedIn, ready } = useLiff();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const groupId = searchParams.get("groupId");

  const [path, setPath] = useState("/");
  const [firstRender, setFirstRender] = useState(false);

  const [profile, setProfile] = useState({});

  console.log(navigate);
  console.log(location);

  useEffect(() => {
    if (!isLoggedIn) return;
    liff.ready.then(() => {
      if (liff.isInClient()) {
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
        liff.getProfile().then((profile) => {
          console.log(profile);
          setProfile(profile);
        });
      } else {
        console.log("Not in line application");
      }
    });
  }, [liff, isLoggedIn]);

  useEffect(() => {
    console.log(searchParams);
    if (searchParams.has("create")) {
      const queryString = `?groupId=${encodeURIComponent(
        JSON.stringify(groupId)
      )}`;

      navigate("/create_bill" + queryString);
    }
    if (searchParams.has("create_equal")) {
      console.log("inside create_equal: " + groupId);
      const queryString = `?groupId=${groupId}`;
      navigate("/add_member" + queryString);
    }

    if (searchParams.has("payment")) {
      const billID = searchParams.get("billId");
      const queryString = `?billId=${billID}`;
      console.log("loggin" + billID);
      navigate("/payment" + queryString);
    }

    if (searchParams.has("confirm")) {
      const queryString = ""; //`?groupId=${groupId}`;
      navigate("/confirm" + queryString);
    }

    if (searchParams.has("summary")) {
      const queryString = `?groupId=${groupId}&userId=${profile.userId}`;
      navigate("/summary" + queryString);
    }
  }, [location.search, navigate]);

  // useEffect(() => {
  //   if (!firstRender) {
  //     for (const [key, value] of searchParams.entries()) {
  //       console.log(key, value);
  //       // navigate(value);
  //       break;
  //     }
  //     setFirstRender(true);
  //   }

  //   // console.log("yayyyy");
  //   // for (const [key, value] of searchParams.entries()) {
  //   //   console.log(key, value);
  //   //   setPath(value);
  //   // }
  //   // navigate(path);
  //   // }
  // }, [firstRender]);

  return (
    <div>
      <Loading />
    </div>
  );
};
export default RedirectUrl;
