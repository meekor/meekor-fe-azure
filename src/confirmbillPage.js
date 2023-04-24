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
  console.log("Confirm");
  console.log(location.state.slip);

  // const [isConfirming, setIsConfirming] = useState(false);
  // const [info, setInfo] = useState();
  const [debts, setDebts] = useState([]);
  const [bill, setBill] = useState({});
  // const [users, setUsers] = useState([]);
  // const [userDict, setUserDict] = useState({});

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
        // setInfo(response.data.data.name);
        setDebts(response.data.data.debts);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  //console.log(bill.name);
  // const m = debts.forEach(function (entry) {
  //   if (entry.user_id == userId) {
  //     entry.status = "paid";
  //   }
  //   //console.log(entry.status);
  // });
  // console.log("NEW");
  // console.log(debts);

  let images = [
    location.state.slip,
    // "https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=600",
    // "https://images.pexels.com/photos/3777622/pexels-photo-3777622.jpeg?auto=compress&cs=tinysrgb&w=600",
    // "https://images.pexels.com/photos/1828875/pexels-photo-1828875.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  const Card = {
    height: "300px",
    borderRadius: "10px",
  };

  const mystyle = {
    alignItems: "center",
    height: "100%",
    textAlign: "center",
  };

  const onSubmit = async () => {
    const m = debts.forEach(function (entry) {
      if (entry.user_id == userId) {
        entry.status = "close";
      }
      //console.log(entry.status);
    });

    //connect data
    console.log("hi");
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
    //console.log(billObject);
    console.log(debts);
    //Save to DB....
    await axios
      .put(`https://meekor.onrender.com/v1/bill/${billId}`, billObject, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((res) => {
        //res return photo id get from upload to imgur
        console.log("yeah");
        console.log(res);
        //qr_url = res.data.qr_photo_id;
        //resBillID = res.data.bill.id;
      });
    console.log("ki");
  };

  return (
    <div>
      <h1>{name}</h1>
      <h1>฿ {amount}</h1>
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
            {/* <img src={location.state.slip} /> */}
          </Splide>
        </center>
      </div>
      <button className="w-full" onClick={onSubmit}>
        ยืนยันจ่ายแล้ว
      </button>
      <button className="w-full">ปฎิเสธ</button>
    </div>
  );
};
export default confirmbillPage;
