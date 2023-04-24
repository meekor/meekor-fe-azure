import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLiff } from "react-liff";
import { FaHeart, FaAngleRight } from "react-icons/fa";

import axios from "axios";

const confirmPage = ({ UserId = "C1fe81d2a7d101b2578259505bd232573" }) => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  // const billId = searchParams.get("billId");
  // const groupId = searchParams.get("groupId");
  const billId = 20;
  const groupId = "C1fe81d2a7d101b2578259505bd232573";

  const [isConfirming, setIsConfirming] = useState(false);
  const [info, setInfo] = useState();
  const [debts, setDebts] = useState([]);
  const [bill, setBill] = useState({});
  const [users, setUsers] = useState([]);
  const [userDict, setUserDict] = useState({});

  useEffect(() => {
    axios
      .get(`https://meekor.onrender.com/v1/group/${groupId}`)
      .then((response) => {
        console.log(response.data.data);
        const dict = response.data.data.users.reduce((acc, item) => {
          acc[item.user_id] = item.display_name;
          return acc;
        }, {});
        setUsers(response.data.data.users);
        setUserDict(dict);
        console.log(dict);
      })
      .catch((err) => console.error(err));
    axios
      .get(`https://meekor.onrender.com/v1/bill/${billId}`, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setBill(response.data.data);
        setInfo(response.data.data.name);
        setDebts(response.data.data.debts);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  console.log("INfo=>" + info);
  console.log(debts);

  const handleConfirmClick = () => {
    setIsConfirming(true);
  };

  const handleConfirmPayment = () => {
    // Code to confirm
    setIsConfirming(false);
  };

  const handleCancelPayment = () => {
    setIsConfirming(false);
  };
  const billname = {
    color: "white",
    backgroundColor: "pink",
    paddingLeft: "10px",
    fontFamily: "Arial",
    fontSize: "50px",
  };
  const price = {
    color: "white",
    backgroundColor: "pink",
    paddingLeft: "10px",
    paddingBottom: "10px",
    fontFamily: "Arial",
    fontSize: "20px",
  };
  const button = {
    padding: "10px",
  };
  const datarow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "pink",
    padding: "10px",
    margin: "10px",
    borderRadius: "10px",
  };

  //mock dept in db
  // const mockdebts = [
  //   { name: "apple", dept: 100, status: "pending" },
  //   { name: "bee", dept: 10, status: "close" },
  //   { name: "cream", dept: 20, status: "open" },
  //   { name: "cake", dept: 50, status: "open" },
  //   { name: "kim", dept: 200, status: "open" },
  // ];

  return (
    <div>
      <div>
        <h1 style={billname}>{bill.name}</h1>
        <h2 style={price}>฿ {bill.total}</h2>
      </div>
      <center>
        <div>
          <p>รอการยืนยัน</p>
          {debts.map((data) => {
            if (data.status == "pending") {
              return (
                <Link
                  key={data.user_id}
                  to={
                    "/confirm_bill?userId=" +
                    data.user_id +
                    "&billId=" +
                    bill.id +
                    "&name=" +
                    userDict[data.user_id] +
                    "&amount=" +
                    data.amount
                  }
                  state={{ slip: data.slip, bill: bill }}
                >
                  <div style={datarow}>
                    <p>{userDict[data.user_id]} </p>
                    <p>{data.amount} </p>
                    <FaAngleRight />
                  </div>
                </Link>
              );
            }
          })}
        </div>
        <div>
          <p>ยังไม่จ่าย</p>
          {debts.map((data) => {
            if (data.status == "open") {
              return (
                <div style={datarow}>
                  <p>{userDict[data.user_id]} </p>
                  <p>{data.amount} </p>
                </div>
              );
            }
          })}
        </div>
        <div>
          <p>จ่ายแล้ว</p>
          {debts.map((data) => {
            if (data.status == "close") {
              return (
                <div style={datarow}>
                  <p>{userDict[data.user_id]} </p>
                  <p>{data.amount} </p>
                </div>
              );
            }
          })}
        </div>
      </center>
    </div>
  );
};
export default confirmPage;

{
  /* <button onClick={handleConfirmClick}>Confirm Payment</button>
{isConfirming && (
  <div className="confirmation">
    <h3>Are you sure you want to confirm this payment?</h3>
    <button onClick={handleConfirmPayment}>Yes</button>
    <button onClick={handleCancelPayment}>No</button>
  </div>
)} */
}
