import { Link, useNavigate } from "react-router-dom";
import { useLiff } from "react-liff";
import YourBillCard from "./yourBillCard.js";
import axios from "axios";
import React, { useState, useEffect, useRef, createRef } from "react";

const YourBillCardDisplay = ({ groupId, userId, userProfiles }) => {
  // TODO getting Line Group ID from the DB
  const [bills, setBills] = useState({});
  const [yourbills, setYourbills] = useState([]);

  const [debtData, setDebtData] = useState([]);
  // Then Get the Bills accoring to Group ID
  // const currentLineID = userId;
  // userId = "U9016c40faeef528b45f43a259f223bde";
  // groupId = "C1fe81d2a7d101b2578259505bd232573";

  // If the user id is matched with the debt then pass the value to JSON
  useEffect(() => {
    axios
      .get(` https://meekor.onrender.com/v1/group/${groupId}/bill`, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((response) => {
        setBills(response.data.data);
        filterBill(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const filterBill = (data) => {
    let b = [];
    console.log("b", data);
    data.forEach((bill) => {
      if (bill.owner_id == userId) {
        b.push(bill);
      }
    });
    console.log("bills", b);
    setYourbills(b);
  };

  const billcards = yourbills.map((bill) => {
    return (
      <YourBillCard
        key={bill.id}
        bill={bill}
        userProfiles={userProfiles}
      ></YourBillCard>
    );
  });

  return (
    <div className="w-3/4" overflow-y-auto>
      {billcards}
      {yourbills.forEach((bill) => {
        console.log(bill);
      })}
      {/* {JSON.stringify(yourbills)} */}
    </div>
  );
};

export default YourBillCardDisplay;
