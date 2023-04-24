import React, { useState, useEffect } from "react";
import { useLiff } from "react-liff";
import axios from "axios";
import CardDisplay from "./components/cardDisplay.js";
import YourBillCardDisplay from "./components/yourBillCardDisplay.js";
const PersonalBillPage = () => {
  const queryParams = new URLSearchParams(location.search);
  // const groupId = queryParams.get("groupId");
  // const userId = queryParams.get("userId");
  const userId = "U9016c40faeef528b45f43a259f223bde";
  const groupId = "C1fe81d2a7d101b2578259505bd232573";

  const [menu, setMenu] = useState(1);
  const [bills, setBills] = useState([]);
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

  return (
    <div>
      <div class="flex flex-col h-full">
        <div class=" w-screen h-32 min-h-1/5 bg-teal-400">
          <h2>uid = {userId}</h2>
          <div class="flex justify-center pink w-full">
            <button
              className="p-3 mr-4 text-black-800 underline underline-offset-2"
              onClick={() => {
                setMenu(1);
              }}
            >
              บิลรอจ่าย
            </button>
            <button
              className="p-3 mr-4 text-black-800 underline underline-offset-2"
              onClick={() => {
                setMenu(2);
              }}
            >
              บิลของคุณ
            </button>
            <button
              className="p-3 mr-4 text-black-800 underline underline-offset-2"
              onClick={() => {
                setMenu(3);
              }}
            >
              บิลทั้งหมด
            </button>
          </div>
        </div>
        {menu == 1 && (
          <div>
            <CardDisplay groupId={groupId} userId={userId}></CardDisplay>
          </div>
        )}
        {menu == 2 && (
          <div>
            <YourBillCardDisplay
              groupId={groupId}
              userId={userId}
            ></YourBillCardDisplay>
          </div>
        )}
        {menu == 3 && (
          <div>
            <CardDisplay groupId={groupId} userId={userId}></CardDisplay>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalBillPage;
