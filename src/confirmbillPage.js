import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLiff } from "react-liff";
import "@splidejs/react-splide/css";
import axios from "axios";

const confirmbillPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const billId = searchParams.get("billId");
  const userId = searchParams.get("userId");
  const name = searchParams.get("name");
  const amount = searchParams.get("amount");
  const currentLineID = searchParams.get("currentLineID");
  const [isConfirm, setIsConfirm] = useState(false);
  //console.log("Confirm");
  //console.log(location.state.slip);
  const { liff } = useLiff();
  const navigate = useNavigate();
  //const history = useHistory();

  const [debts, setDebts] = useState([]);
  const [bill, setBill] = useState({});

  useEffect(() => {
    axios
      .get(`https://meekor-be.azurewebsites.net/v1/bill/${billId}`, {
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
    // }, []);
  }, [[isConfirm]]);

  let images = [location.state.slip];
  //let images = [];

  const sendClosebillFlex = async () => {
    const closebill_message = {
      type: "flex",
      altText: "close bill flex",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "🎉 บิล " + bill.name + " 🎉 \nจ่ายครบทุกคนแล้ว",
              wrap: true,
              weight: "bold",
              gravity: "center",
              size: "lg",
              style: "normal",
              align: "center",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text:
                        "บิล" +
                        bill.name +
                        " จ่ายครบทุกคนแล้วนะค้าบ แล้วมาให้หมีขอช่วยเก็บตังค์ใหม่น้า",
                      wrap: true,
                      size: "md",
                      color: "#666666",
                      flex: 4,
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    liff
      .sendMessages([closebill_message])
      .then(() => {
        console.log("close bill message sent");
      })
      .catch((err) => {
        console.log("error", err);
      });
    //console.log("mt");
  };

  const sendNotConfirmFlex = async () => {
    const notconfirm_message = {
      type: "flex",
      altText: "not confirm flex",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "❌ไม่ยืนยัน",
              wrap: true,
              weight: "bold",
              gravity: "center",
              size: "lg",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text:
                        "@" + name + " ไม่ได้รับการยืนยันจากเจ้าของบิลนะคับ",
                      wrap: true,
                      size: "md",
                      flex: 4,
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      size: "md",
                      flex: 1,
                      text: "ชื่อบิล:",
                    },
                    {
                      type: "text",
                      text: bill.name,
                      wrap: true,
                      color: "#ff82a7",
                      size: "md",
                      flex: 4,
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "สถานะ:",
                      size: "md",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: "ยังไม่จ่าย",
                      wrap: true,
                      color: "#ff82a7",
                      size: "md",
                      flex: 4,
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    liff
      .sendMessages([notconfirm_message])
      .then(() => {
        console.log("not confirm message sent");
      })
      .catch((err) => {
        console.log("confirm message error: ", err);
      });
    //console.log("mt");
  };

  const sendConfirmFlex = async () => {
    const confirm_message = {
      type: "flex",
      altText: "confirm",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "✔️ยืนยันเรียบร้อย",
              wrap: true,
              weight: "bold",
              gravity: "center",
              size: "lg",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text:
                        "@" +
                        name +
                        " ได้รับการยืนยันจากเจ้าของบิลว่าจ่ายจริงๆแล้วคับ",
                      wrap: true,
                      size: "md",
                      flex: 4,
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      size: "md",
                      flex: 1,
                      text: "ชื่อบิล:",
                    },
                    {
                      type: "text",
                      text: bill.name,
                      wrap: true,
                      color: "#ff82a7",
                      size: "md",
                      flex: 4,
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "สถานะ:",
                      size: "md",
                      flex: 1,
                    },
                    {
                      type: "text",
                      text: "จ่ายแล้ว",
                      wrap: true,
                      color: "#ff82a7",
                      size: "md",
                      flex: 4,
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    liff
      .sendMessages([confirm_message])
      .then(() => {
        console.log("confirm message sent");
      })
      .catch((err) => {
        console.log("error", err);
      });
    //console.log("mt");
  };

  const handleCloseStatus = async () => {
    let isConfirm = window.confirm("ยืนยันการจ่ายของสลิปนี้");
    console.log("handle func called");
    if (!isConfirm) {
      return 0;
    }

    const m = debts.forEach(function (entry) {
      if (entry.user_id == userId) {
        entry.status = "close";
      }
    });
    await sendConfirmFlex();

    //close bill
    let billStatus = bill.status;
    const allclose = debts.every((debts) => debts.status === "close");
    if (allclose) {
      billStatus = "close";
      await sendClosebillFlex();
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
      .put(`https://meekor-be.azurewebsites.net/v1/bill/${billId}`, billObject, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((res) => {
        console.log("Dept status set to close");
        // window.location.href =
        //   "/confirm?billId=" + bill.id + "&groupId=" + bill.group_id;
        //console.log("allclose:" + allclose);
        //window.location.reload(false);
        //liff.closeWindow();

        navigate("/confirm?billId=" + bill.id + "&groupId=" + bill.group_id);
      })
      .catch((error) => {
        console.error("ok button: " + error);
      });

    //setIsConfirm(!isConfirm);
  };

  const handleOpenStatus = async () => {
    let isConfirm = window.confirm("ปฎิเสธสลิปนี้");
    if (!isConfirm) {
      return 0;
    }
    const m = debts.forEach(function (entry) {
      if (entry.user_id == userId) {
        entry.status = "open";
      }
    });
    await sendNotConfirmFlex();
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
      .put(`https://meekor-be.azurewebsites.net/v1/bill/${billId}`, billObject, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((res) => {
        console.log("Status set to open");
        console.log(res);
        // window.location.href =
        //   "/confirm?billId=" + bill.id + "&groupId=" + bill.group_id;
        //window.location.reload(false);
        //liff.closeWindow();
        navigate("/confirm?billId=" + bill.id + "&groupId=" + bill.group_id);
      })
      .catch((error) => {
        console.error("close button: " + error);
      });

    //setIsConfirm(!isConfirm);
  };

  const Card = {
    height: "300px",
    borderRadius: "10px",
    marginTop: "20px",
  };

  // const mystyle = {
  //   //alignItems: "center",
  //   height: "100%",
  //   //textAlign: "center",
  // };

  return (
    <div className="cream min-h-screen">
      <div className="flex w-screen h-32 min-h-1/5 pink rounded-b-3xl drop-shadow-lg">
        <div>
          <h1 className="text-white text-3xl font-bold ml-5 pt-8">
            จ่ายโดย {name}
          </h1>
          <h1 className="text-white text-xl font-bold ml-5">
            ยอดเงิน ฿ {amount}
          </h1>
        </div>

        <svg
          class="ml-auto mt- mr-4"
          fill="#694D43"
          height="91px"
          width="91px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-61.44 -61.44 634.88 634.88"
          transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"
          stroke="#000000"
          stroke-width="0.00512"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#CCCCCC"
            stroke-width="1.024"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M217.592,177.33c-9.281-4.843-15.688-11.31-15.542-21.778c0-29.971-24.296-54.267-54.267-54.267 s-54.267,24.297-54.267,54.267c0.297,10.065-4.255,17.641-12.911,22.785c-20.12,11.958-35.002,41.52-35.002,51.807 c0,29.971,24.296,54.267,54.267,54.267c3.697,0,7.307-0.37,10.796-1.074c24.648-4.978,49.649-4.931,74.303,0.015 c3.467,0.695,7.054,1.061,10.726,1.061c29.971,0,54.268-24.296,54.268-54.267C249.964,213.29,237.001,187.458,217.592,177.33z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M209.187,0.451c-18.792-4.414-41.67,24.543-46.084,43.337c-4.415,18.791,7.24,37.605,26.034,42.019 c18.792,4.414,37.606-7.241,42.02-26.034C235.571,40.981,227.979,4.866,209.187,0.451z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M274.937,83.318c-17.01-3.996-37.717,22.216-41.713,39.225c-3.996,17.01,6.555,34.038,23.565,38.034 c17.01,3.996,34.038-6.555,38.034-23.565C298.819,120.002,291.947,87.313,274.937,83.318z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M132.476,43.787c-4.413-18.792-27.291-47.75-46.083-43.336C67.6,4.866,60.008,40.98,64.422,59.772 c4.414,18.793,23.228,30.449,42.02,26.035C125.234,81.393,136.89,62.58,132.476,43.787z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M63.819,122.543c-3.996-17.01-24.702-43.221-41.713-39.225C5.096,87.314-1.775,120.002,2.22,137.013 c3.996,17.01,21.024,27.56,38.034,23.565C57.265,156.582,67.814,139.554,63.819,122.543z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M432.548,404.918c-9.281-4.843-15.688-11.31-15.542-21.778c0-29.971-24.296-54.267-54.267-54.267 s-54.267,24.296-54.267,54.267c0.297,10.065-4.255,17.641-12.911,22.785c-20.12,11.958-35.002,41.52-35.002,51.807 c0,29.971,24.296,54.267,54.267,54.267c3.697,0,7.307-0.37,10.796-1.074c24.648-4.978,49.649-4.931,74.303,0.015 c3.467,0.695,7.054,1.061,10.726,1.061c29.971,0,54.267-24.296,54.267-54.267C464.92,440.878,451.957,415.046,432.548,404.918z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M424.143,228.039c-18.792-4.414-41.67,24.543-46.084,43.337c-4.414,18.791,7.242,37.605,26.034,42.019 c18.792,4.414,37.606-7.241,42.02-26.034C450.527,268.568,442.935,232.453,424.143,228.039z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M489.893,310.906c-17.01-3.996-37.717,22.216-41.713,39.225c-3.996,17.009,6.555,34.038,23.565,38.034 c17.01,3.996,34.038-6.555,38.034-23.565C513.775,347.59,506.903,314.901,489.893,310.906z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M347.433,271.374c-4.414-18.792-27.291-47.751-46.084-43.336c-18.792,4.415-26.384,40.53-21.97,59.323 c4.414,18.792,23.227,30.448,42.02,26.034C340.191,308.979,351.847,290.167,347.433,271.374z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M278.775,350.131c-3.996-17.01-24.703-43.221-41.713-39.225c-17.01,3.996-23.882,36.684-19.887,53.694 c3.995,17.01,21.024,27.56,38.034,23.565C272.221,384.169,282.77,367.141,278.775,350.131z"></path>{" "}
              </g>{" "}
            </g>{" "}
          </g>
        </svg>
      </div>

      <div className="h-full px-4 py-6">
        <center>
          {images.map((image) => {
            return <img src={image} style={Card} />;
          })}
        </center>
      </div>
      {/* <div>
        <p>current {currentLineID} </p>
        <p>owner {bill.owner_id}</p>
        <p>user {userId}</p>
      </div> */}
      {currentLineID == bill.owner_id ? (
        <div className="flex flex-col items-center mt-3">
          <button
            className="pink w-2/3 px-5 py-3 mb-3 text-white text-md font-normal rounded-xl drop-shadow-xl"
            onClick={handleCloseStatus}
          >
            ยืนยันจ่ายแล้ว
          </button>
          <button
            className="softred w-2/3 px-5 py-3 text-white text-md font-normal rounded-xl drop-shadow-xl"
            onClick={handleOpenStatus}
          >
            ปฎิเสธ
          </button>
        </div>
      ) : null}
    </div>
  );
};
export default confirmbillPage;
