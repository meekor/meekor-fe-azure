import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLiff } from "react-liff";
import { FaHeart, FaAngleRight } from "react-icons/fa";
import { Splide, SplideSlide } from "@splidejs/react-splide";
// import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import "@splidejs/react-splide/css";
import axios from "axios";

const confirmbillPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const billId = searchParams.get("billId");
  const userId = searchParams.get("userId");
  const name = searchParams.get("name");
  const amount = searchParams.get("amount");
  //console.log("Confirm");
  //console.log(location.state.slip);
  const { liff } = useLiff();

  const [debts, setDebts] = useState([]);
  const [bill, setBill] = useState({});

  useEffect(() => {
    axios
      .get(`https://meekor.onrender.com/v1/bill/${billId}`, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setBill(response.data.data);
        setDebts(response.data.data.debts);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  let images = [
    location.state.slip,
    "https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3777622/pexels-photo-3777622.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1828875/pexels-photo-1828875.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  const handleCloseStatus = async () => {
    //change debt status
    const m = debts.forEach(function (entry) {
      if (entry.user_id == userId) {
        entry.status = "close";
      }
    });

    //close bill
    let billStatus = bill.status;
    const allclose = debts.every((debts) => debts.status === "close");
    if (allclose) {
      billStatus = "close";
    }

    const billObject = {
      name: bill.name,
      total: bill.total,
      status: billStatus,
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
        liff.closeWindow();
      })
      .catch((error) => {
        console.error("ok button: " + error);
      });
  };

  const handleOpenStatus = async () => {
    const m = debts.forEach(function (entry) {
      if (entry.user_id == userId) {
        entry.status = "open";
      }
    });
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
        //window.close();
        liff.closeWindow();
      })
      .catch((error) => {
        console.error("close button: " + error);
      });

    if (allclose) {
      billStatus = "close";

      const message = {
        type: "flex",
        altText: "Close bill",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "text",
                text: "บิล" + name + " จ่ายบิลครบแล้ว",
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

  const Card = {
    height: "300px",
    borderRadius: "10px",
    marginTop: "20px",
  };

  const mystyle = {
    //alignItems: "center",
    height: "100%",
    //textAlign: "center",
  };

  const namestyle = {
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
    paddingBottom: "20px",
    fontFamily: "Arial",
    fontSize: "20px",
    borderRadius: "0px 0px  20px 20px",
  };
  const buttonStyle = {
    backgroundColor: "rgba(255, 136, 158, 1)",
    color: "white",
    width: "50%",
    fontSize: "13px",
    padding: "10px",
    margin: "5px",
    borderRadius: "10px",
  };

  return (
    <div>
      <h1 style={namestyle}>{name}</h1>
      <h1 style={price}>฿ {amount}</h1>
      <div style={mystyle}>
        <center>
          <Splide
            options={{
              rewind: true,
              width: 800,
              gap: "1rem",
              perPage: 1,
            }}
          >
            {images.map((image) => {
              return (
                <SplideSlide key={image}>
                  <img src={image} style={Card} />
                </SplideSlide>
              );
            })}
          </Splide>
        </center>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          style={buttonStyle}
          className="w-full"
          onClick={handleCloseStatus}
        >
          ยืนยันจ่ายแล้ว
        </button>
        <button
          style={buttonStyle}
          className="w-full"
          onClick={handleOpenStatus}
        >
          ปฎิเสธ
        </button>
      </div>
    </div>
  );
};
export default confirmbillPage;
