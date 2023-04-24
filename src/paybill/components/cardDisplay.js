import { Link, useNavigate } from "react-router-dom";
import { useLiff } from "react-liff";
import DebtCard from "./debtCard.js";
import axios from "axios";
import React, { useState, useEffect, useRef, createRef } from "react";
// import { getUserProfile } from "../../lineApi.js";

const CardDisplay = ({ groupId, userId }) => {
  // TODO getting Line Group ID from the DB
  const [bill, setBill] = useState([]);
  const [debtData, setDebtData] = useState([]);
  // Then Get the Bills accoring to Group ID
  const currentLineID = userId;
  // getUserProfile(groupId, bill.owner_id);

  const convertResponseBill = (response) => {
    let debtData = [];
    response.forEach((bill) => {
      // let existingPayment = debtData.find(
      //   (data) => data.payment.account_number === bill.payment.account_number
      // );
      // if (existingPayment) {
      //   existingPayment.bill.push({
      //     id: bill.id,
      //     name: bill.name,
      //     amount: getDebtAmount(bill.debts),
      //   });
      // } else {
      // const userProfile =  getUserProfile(groupId, bill.owner_id);

      // console.log(bill.debts);
      for (let debt in bill.debts) {
        if (bill.debts[debt].user_id == currentLineID) {
          debtData.push({
            owner_id: bill.owner_id,
            owner_name: "gade", // Find the name of the owner by using liff api
            payment: bill.payment,
            bill: [
              {
                id: bill.id,
                name: bill.name,
                amount: getDebtAmount(bill.debts),
              },
            ],
          });
        }
      }
    });
    setDebtData(debtData);
    // console.log(debtData);
  };

  // Unecessary loop; Will fix later
  const getDebtAmount = (debts) => {
    for (let debt in debts) {
      if (debts[debt].user_id == currentLineID) {
        return debts[debt].amount;
      }
    }
    return null;
  };

  // Mocking up the Debt from the Bill

  // If the user id is matched with the debt then pass the value to JSON
  useEffect(() => {
    // const groupId = "C1fe81d2a7d101b2578259505bd232573"; // TODO set group ID from liff api or urlparam
    axios
      .get(` https://meekor.onrender.com/v1/group/${groupId}/bill`, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((response) => {
        console.log(response);
        convertResponseBill(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div class overflow-y-auto>
      {debtData.map((data) => (
        <DebtCard debtData={data}></DebtCard>
      ))}
    </div>
  );
};

export default CardDisplay;
