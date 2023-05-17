import { Link, useNavigate } from "react-router-dom";
import { useLiff } from "react-liff";
import DebtCard from "./allBillCard.js";
import axios from "axios";
import React, { useState, useEffect, useRef, createRef } from "react";
// import { getUserProfile } from "../../lineApi.js";

const AllBillDisplay = ({ groupId, userId, userProfiles }) => {
  // TODO getting Line Group ID from the DB
  const [bill, setBill] = useState([]);
  const [debtData, setDebtData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [totalSpend, setTotalSpend] = useState(0);
  // Then Get the Bills accoring to Group ID
  const currentLineID = userId;
  // getUserProfile(groupId, bill.owner_id);

  // Find total spedings for each month
  let sumTotalSpend = 0;

  const convertResponseBill = (response) => {
    let debtData = [];
    response.forEach((bill) => {
      for (let debt in bill.debts) {
        if (bill.debts[debt].user_id == currentLineID) {
          const billDate = new Date(bill.created_at);
          if (billDate.getMonth() == selectedMonth) {
            let debtAmount = getDebtAmount(bill.debts);
            sumTotalSpend += debtAmount;
            debtData.push({
              owner_id: bill.owner_id,
              owner_name: findOwnerName(bill.owner_id), // Find the name of the owner by using liff api
              payment: bill.payment,
              bill: {
                id: bill.id,
                name: bill.name,
                date: bill.created_at,
                items: bill.items,
                debts: bill.debts,
                amount: getDebtAmount(bill.debts),
              },
            });
          }
        }
      }
    });
    setDebtData(debtData);
    setTotalSpend(sumTotalSpend.toFixed(2));
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

  const findOwnerName = (id) => {
    const owner = userProfiles.find((profile) => profile.user_id === id);
    if (owner) {
      return owner.display_name;
    }
    return null;
  };

  const handleMonthSelect = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setSelectedMonth(selectedMonth);
    convertResponseBill(bill);
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
  }, [, selectedMonth]);

  return (
    <div className="w-full ">
      <div className="">
        <div className="mb-4 w-full flex ml-5">
          รวมยอดเดือน
          <select
            className=" border-none rounded-lg bg-transparent bg-none drop-shadow-none ml-2 text-red-900"
            value={selectedMonth}
            onChange={handleMonthSelect}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <option key={index} value={index}>
                {new Date(0, index).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
          <span className=" text-lg font-mint font-semibold">
            {totalSpend} บาท
          </span>
        </div>
      </div>
      <div className="flex w-screen justify-center">
        <div className="w-3/4" overflow-y-auto>
          {debtData.map((data) => (
            <DebtCard debtData={data} userProfiles={userProfiles}></DebtCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllBillDisplay;
