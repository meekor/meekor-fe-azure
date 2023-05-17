import React, { useState, useEffect } from "react";
import { useLiff } from "react-liff";
import axios from "axios";
import CardDisplay from "./components/cardDisplay.js";
import YourBillCardDisplay from "./components/yourBillCardDisplay.js";
import AllBillDisplay from "./components/allBillDisplay.js";

const PersonalBillPage = () => {
  const queryParams = new URLSearchParams(location.search);
  const [usersProfile, setUsersProfile] = useState({});

  const groupId = queryParams.get("groupId");
  // const userId = queryParams.get("userId");
  // const userId = "U9016c40faeef528b45f43a259f223bde";
  // const groupId = "C1fe81d2a7d101b2578259505bd232573";

  const [menu, setMenu] = useState(3);
  const [bills, setBills] = useState([]);

  const [profile, setProfile] = useState({
    userId: "Default",
    displayName: "Default",
  });

  const { liff, isLoggedIn } = useLiff();

  useEffect(() => {
    if (!isLoggedIn) return;
    if (liff.isInClient()) {
      liff.getProfile().then((profile) => {
        setProfile(profile);
        console.log(profile);
      });
    }
  }, [liff, isLoggedIn]);

  useEffect(() => {
    axios
      .get(` https://meekor.onrender.com/v1/group/${groupId}/bill`, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((response) => {
        // console.log(response.data.data);
        setBills(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (groupId) {
      axios
        .get(`https://meekor-be.azurewebsites.net/v1/group/${groupId}`)
        .then((res) => {
          console.log(res);
          //res.data.users -> list of user in the group
          setUsersProfile(res.data.data.users);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className=" h-full min-h-screen cream w-screen">
      <div class="flex flex-col h-full ">
        <div class="w-screen pink h-20 ">
          <h1 class="font-bold text-3xl text-center text-white align-bottom py-4">
            {" "}
            รวมบิล
          </h1>
        </div>
        <div class="flex justify-center softpink w-full rounded-b-3xl">
          <button
            className={
              menu == 1
                ? "p-3 mr-4 text-red-800 underline underline-offset-2"
                : "p-3 mr-4 hover:text-red-800 "
            }
            onClick={() => {
              setMenu(1);
            }}
          >
            บิลรอจ่าย
          </button>
          <button
            className={
              menu == 2
                ? "p-3 mr-4 text-red-800 underline underline-offset-2"
                : "p-3 mr-4 hover:text-red-800 "
            }
            onClick={() => {
              setMenu(2);
            }}
          >
            บิลของคุณ
          </button>
          <button
            className={
              menu == 3
                ? "p-3 mr-4 text-red-800 underline underline-offset-2"
                : "p-3 mr-4 hover:text-red-800 "
            }
            onClick={() => {
              setMenu(3);
            }}
          >
            บิลทั้งหมด
          </button>
        </div>
        {/* <h2>uid = {userId}</h2> */}
        {menu == 1 && (
          <div className="flex w-screen justify-center my-10">
            <CardDisplay
              groupId={groupId}
              userId={profile.userId}
              userProfiles={usersProfile}
            ></CardDisplay>
          </div>
        )}
        {menu == 2 && (
          <div className="flex w-screen justify-center my-10">
            <YourBillCardDisplay
              groupId={groupId}
              userId={profile.userId}
              userProfiles={usersProfile}
            ></YourBillCardDisplay>
          </div>
        )}
        {menu == 3 && (
          <div className="flex w-screen justify-center my-10">
            <AllBillDisplay
              groupId={groupId}
              userId={profile.userId}
              userProfiles={usersProfile}
            ></AllBillDisplay>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalBillPage;
