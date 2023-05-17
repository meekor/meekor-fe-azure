import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLiff } from "react-liff";
import { FaHeart, FaAngleRight } from "react-icons/fa";

import axios from "axios";

const confirmPage = ({ UserId = "C1fe81d2a7d101b2578259505bd232573" }) => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const billId = searchParams.get("billId");
  const groupId = searchParams.get("groupId");
  // const billId = 20;
  // const groupId = "C1fe81d2a7d101b2578259505bd232573";

  // const billId = 102;
  // const groupId = "C5c5702e477f75f7e73a055630b867650";

  const [info, setInfo] = useState();
  const [debts, setDebts] = useState([]);
  const [bill, setBill] = useState({});
  const [users, setUsers] = useState([]);
  const [userDict, setUserDict] = useState({});
  const [profileDict, setProfileDict] = useState({});

  let hasBankPendingDebt = false;
  let hasCashPendingDebt = false;
  let hasOpenDebt = false;
  let hasCloseDebt = false;

  const [profile, setProfile] = useState({
    userId: "Default",
    displayName: "Default",
  });
  const [currentLineID, setCurrentLineID] = useState("");

  const { liff, isLoggedIn } = useLiff();
  useEffect(() => {
    if (!isLoggedIn) return;
    if (liff.isInClient()) {
      liff.getProfile().then((profile) => {
        setProfile(profile);
        //console.log("Happy");
        console.log(profile);
        setCurrentLineID(profile.userId);
      });
    }
  }, [liff, isLoggedIn]);

  useEffect(() => {
    axios
      .get(`https://meekor-be.azurewebsites.net/v1/group/${groupId}`)
      .then((response) => {
        console.log("Happy");
        console.log(response.data.data);
        //user display name
        const dict = response.data.data.users.reduce((acc, item) => {
          acc[item.user_id] = item.display_name;
          return acc;
        }, {});
        //user picture profile
        const profiledict = response.data.data.users.reduce((acc, item) => {
          acc[item.user_id] = item.picture_url;
          return acc;
        }, {});
        setUsers(response.data.data.users);
        setUserDict(dict);
        setProfileDict(profiledict);
        console.log("happy");
        console.log(dict);
        //console.log(profileDict);
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

  // console.log("INfo=>" + info);
  // console.log(debts);

  const handleCloseStatus = async (userid) => {
    const m = debts.forEach(function (entry) {
      if (entry.user_id == userid) {
        entry.status = "close";
      }
    });

    //close bill
    let billStatus = bill.status;
    const allclose = debts.every((debts) => debts.status === "close");
    if (allclose) {
      billStatus = "close";
      console.log("bill closed");
    }

    const billObject = {
      name: bill.name,
      total: bill.total,
      status: bill.status,
      owner_id: bill.owner_id,
      payment: {
        update: {
          qr_code: bill.payment.qr_code,
          bank_info: bill.payment.bank_info,
          account_name: bill.account_name,
          account_number: bill.account_number,
        },
      },
      debts: debts,
      items: bill.items,
    };
    await axios
      .put(`https://meekor.onrender.com/v1/bill/${billId}`, billObject, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((res) => {
        console.log("Status set to close");
        console.log(res);
        //window.location.reload(false);
      })
      .catch((error) => {
        console.error("ok button: " + error);
      });

    if (allclose) {
      billStatus = "close";

      const message = {
        type: "flex",
        altText: "alert cash payment",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "text",
                text: "บิล" + bill.name + " จ่ายบิลครบแล้ว",
                wrap: true,
                weight: "bold",
                gravity: "center",
                size: "xl",
              },
            ],
          },
        },
      };
      liff
        .sendMessages([message])
        .then(() => {
          console.log("message sent");
          liff.closeWindow();
        })
        .catch((err) => {
          console.log("error sending message liff", err);
        });
    }
  };

  console.log(profileDict);

  const handleOpenStatus = async (userid) => {
    const m = debts.forEach(function (entry) {
      if (entry.user_id == userid) {
        entry.status = "open";
      }
    });
    console.log("close");
    const billObject = {
      name: bill.name,
      total: bill.total,
      status: bill.status,
      owner_id: bill.owner_id,
      payment: {
        update: {
          qr_code: bill.payment.qr_code,
          bank_info: bill.payment.bank_info,
          account_name: bill.account_name,
          account_number: bill.account_number,
        },
      },
      debts: debts,
      items: bill.items,
    };
    await axios
      .put(`https://meekor.onrender.com/v1/bill/${billId}`, billObject, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((res) => {
        console.log("Status set to open");
        console.log(res);
        window.location.reload(false);
      })
      .catch((error) => {
        console.error("close button: " + error);
      });
  };

  const billname = {
    color: "white",
    backgroundColor: "rgba(255, 136, 158, 0.8)",
    paddingLeft: "20px",
    fontFamily: "Arial",
    fontSize: "50px",
  };
  const price = {
    color: "white",
    backgroundColor: "rgba(255, 136, 158, 0.8)",
    paddingLeft: "20px",
    paddingBottom: "15px",
    fontFamily: "Arial",
    fontSize: "20px",
    borderRadius: "0px 0px  20px 20px",
  };

  const datarow = {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "pink",
    padding: "10px",
    margin: "10px",
    borderRadius: "10px",
  };

  const card = {
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
    alignItems: "right",
    margin: "10px",
    borderRadius: "10px",
    backgroundColor: "rgba(248, 173, 187, 1)",
    //opacity: "10%",
  };

  const buttonStyle = {
    backgroundColor: "rgba(255, 136, 158, 1)",
    color: "white",
    fontSize: "13px",
    padding: "10px",
    margin: "5px",
    borderRadius: "10px",
  };

  const imagestyle = {
    width: "30px",
    height: "30px",
    overflow: "hidden",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 75,
  };

  const profilestyle = {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "40%",
  };

  return (
    <div>
      <div>
        <h1 style={billname}>{bill.name}</h1>
        <h2 style={price}>฿ {bill.total}</h2>
      </div>
      {currentLineID == bill.owner_id ? (
        <center>
          <div>
            {debts.map((data) => {
              if (data.status == "pending" && data.slip) {
                if (!hasBankPendingDebt) {
                  hasBankPendingDebt = true;
                  return <p>รอการยืนยันการโอน</p>;
                }
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "pending" && data.slip) {
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
                      <div style={profilestyle}>
                        {profileDict[data.user_id] === "" ? (
                          <img
                            src={
                              "https://images.pexels.com/photos/1828875/pexels-photo-1828875.jpeg?auto=compress&cs=tinysrgb&w=600"
                            }
                            style={imagestyle}
                          />
                        ) : (
                          <img
                            src={profileDict[data.user_id]}
                            style={imagestyle}
                          />
                        )}
                        <p style={{ alignItems: "left", width: "50%" }}>
                          {userDict[data.user_id]}{" "}
                        </p>
                      </div>
                      <p>{data.amount} </p>
                      <FaAngleRight />
                    </div>
                  </Link>
                );
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "pending" && !data.slip) {
                if (!hasCashPendingDebt) {
                  hasCashPendingDebt = true;
                  return <p>รอการยืนยันเงินสด</p>;
                }
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "pending" && !data.slip) {
                return (
                  <div style={card}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "pink",
                        padding: "10px",
                        marginButtom: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <div style={profilestyle}>
                        {profileDict[data.user_id] === "" ? (
                          <img
                            src={
                              "https://images.pexels.com/photos/1828875/pexels-photo-1828875.jpeg?auto=compress&cs=tinysrgb&w=600"
                            }
                            style={imagestyle}
                          />
                        ) : (
                          <img
                            src={profileDict[data.user_id]}
                            style={imagestyle}
                          />
                        )}
                        <p style={{ alignItems: "left", width: "50%" }}>
                          {userDict[data.user_id]}{" "}
                        </p>
                      </div>
                      <p>{data.amount} </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        style={buttonStyle}
                        onClick={() => handleCloseStatus(data.user_id)}
                      >
                        ยืนยัน
                      </button>
                      <button
                        style={buttonStyle}
                        onClick={() => handleOpenStatus(data.user_id)}
                      >
                        ไม่ยืนยัน
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "open") {
                if (!hasOpenDebt) {
                  hasOpenDebt = true;
                  return <p>ยังไม่จ่าย</p>;
                }
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "open") {
                return (
                  <div style={datarow}>
                    <div style={profilestyle}>
                      {profileDict[data.user_id] === "" ? (
                        <img
                          src={
                            "https://images.pexels.com/photos/1828875/pexels-photo-1828875.jpeg?auto=compress&cs=tinysrgb&w=600"
                          }
                          style={imagestyle}
                        />
                      ) : (
                        <img
                          src={profileDict[data.user_id]}
                          style={imagestyle}
                        />
                      )}
                      <p style={{ alignItems: "left", width: "50%" }}>
                        {userDict[data.user_id]}
                      </p>
                    </div>
                    <p>{data.amount}</p>
                  </div>
                );
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "close") {
                if (!hasCloseDebt) {
                  hasCloseDebt = true;
                  return <p>จ่ายแล้ว</p>;
                }
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "close") {
                return (
                  <div style={datarow}>
                    <div style={profilestyle}>
                      {profileDict[data.user_id] === "" ? (
                        <img
                          src={
                            "https://images.pexels.com/photos/1828875/pexels-photo-1828875.jpeg?auto=compress&cs=tinysrgb&w=600"
                          }
                          style={imagestyle}
                        />
                      ) : (
                        <img
                          src={profileDict[data.user_id]}
                          style={imagestyle}
                        />
                      )}
                      <p style={{ alignItems: "left", width: "50%" }}>
                        {userDict[data.user_id]}
                      </p>
                    </div>
                    <p>{data.amount}</p>
                  </div>
                );
              }
            })}
          </div>
        </center>
      ) : (
        <center>
          <div>
            {debts.map((data) => {
              if (data.status == "pending" && data.slip) {
                if (!hasBankPendingDebt) {
                  hasBankPendingDebt = true;
                  return <p>รอการยืนยันการโอน</p>;
                }
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "pending" && data.slip) {
                return (
                  <div style={datarow}>
                    <div style={profilestyle}>
                      {profileDict[data.user_id] === "" ? (
                        <img
                          src={
                            "https://images.pexels.com/photos/1828875/pexels-photo-1828875.jpeg?auto=compress&cs=tinysrgb&w=600"
                          }
                          style={imagestyle}
                        />
                      ) : (
                        <img
                          src={profileDict[data.user_id]}
                          style={imagestyle}
                        />
                      )}
                      <p style={{ alignItems: "left", width: "50%" }}>
                        {userDict[data.user_id]}
                      </p>
                    </div>
                    <p>{data.amount}</p>
                  </div>
                );
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "pending" && !data.slip) {
                if (!hasCashPendingDebt) {
                  hasCashPendingDebt = true;
                  return <p>รอการยืนยันเงินสด</p>;
                }
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "pending" && !data.slip) {
                return (
                  <div style={datarow}>
                    <div style={profilestyle}>
                      {profileDict[data.user_id] === "" ? (
                        <img
                          src={
                            "https://images.pexels.com/photos/1828875/pexels-photo-1828875.jpeg?auto=compress&cs=tinysrgb&w=600"
                          }
                          style={imagestyle}
                        />
                      ) : (
                        <img
                          src={profileDict[data.user_id]}
                          style={imagestyle}
                        />
                      )}
                      <p style={{ alignItems: "left", width: "50%" }}>
                        {userDict[data.user_id]}
                      </p>
                    </div>
                    <p>{data.amount}</p>
                  </div>
                );
              }
            })}
          </div>

          <div>
            {debts.map((data) => {
              if (data.status == "open") {
                if (!hasOpenDebt) {
                  hasOpenDebt = true;
                  return <p>ยังไม่จ่าย</p>;
                }
              }
            })}
          </div>
          <div>
            {debts.map((data) => {
              if (data.status == "open") {
                return (
                  <div style={datarow}>
                    <div style={profilestyle}>
                      {profileDict[data.user_id] === "" ? (
                        <img
                          src={
                            "https://images.pexels.com/photos/1828875/pexels-photo-1828875.jpeg?auto=compress&cs=tinysrgb&w=600"
                          }
                          style={imagestyle}
                        />
                      ) : (
                        <img
                          src={profileDict[data.user_id]}
                          style={imagestyle}
                        />
                      )}
                      <p style={{ alignItems: "left", width: "50%" }}>
                        {userDict[data.user_id]}
                      </p>
                    </div>
                    <p>{data.amount}</p>
                  </div>
                );
              }
            })}
          </div>

          <div>
            {debts.map((data) => {
              if (data.status == "close") {
                if (!hasCloseDebt) {
                  hasCloseDebt = true;
                  return <p>จ่ายแล้ว</p>;
                }
              }
            })}
          </div>

          <div>
            {debts.map((data) => {
              if (data.status == "close") {
                return (
                  <div style={datarow}>
                    <div style={profilestyle}>
                      {profileDict[data.user_id] === "" ? (
                        <img
                          src={
                            "https://images.pexels.com/photos/1828875/pexels-photo-1828875.jpeg?auto=compress&cs=tinysrgb&w=600"
                          }
                          style={imagestyle}
                        />
                      ) : (
                        <img
                          src={profileDict[data.user_id]}
                          style={imagestyle}
                        />
                      )}
                      <p style={{ alignItems: "left", width: "50%" }}>
                        {userDict[data.user_id]}
                      </p>
                    </div>
                    <p>{data.amount}</p>
                  </div>
                );
              }
            })}
          </div>
        </center>
      )}
    </div>
  );
};
export default confirmPage;

//mock dept in db
// const mockdebts = [
//   { name: "apple", dept: 100, status: "pending" },
//   { name: "bee", dept: 10, status: "close" },
//   { name: "cream", dept: 20, status: "open" },
//   { name: "cake", dept: 50, status: "open" },
//   { name: "kim", dept: 200, status: "open" },
// ];
