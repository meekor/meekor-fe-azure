import React, { useState, useEffect } from "react";
import { useLiff } from "react-liff";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";

import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  console.log(queryParams.get("billId"));

  const [message, setMessage] = useState("loading");

  const billID = queryParams.get("billId");

  const [totalDebtAmount, setTotalDebtAmount] = useState(-1);
  const [bill, setBill] = useState({});
  const [bankInfo, setBankInfo] = useState("");
  const [billName, setBillName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [promptPayQr, setPromptPayQr] = useState("");

  const [currentLineID, setCurrentLineID] = useState("");
  const [profile, setProfile] = useState({});
  const [userDebtIndex, setUserDebtIndex] = useState(-1);
  const [paidMessage, setPaidMessage] = useState("");

  const { error, liff, isLoggedIn, ready } = useLiff();
  const copyBankInfo = () => {
    // navigator.clipboard.writeText(bankInfo);
    if ("clipboard" in navigator) {
      console.log("Hello from navigator copy");
      navigator.clipboard
        .writeText(bankInfo)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      console.log("Hello from execCommand copy");
      document.execCommand("copy", true, bankInfo);
    }
  };

  const goToBankTransfer = () => {
    console.log(bill);
    console.log(totalDebtAmount);
    navigate("/banktransfer", {
      state: { bill, totalDebtAmount, profile, userDebtIndex },
    });
  };

  const goToCashPay = () => {
    navigate("/cashpay", {
      state: { bill, totalDebtAmount, profile, userDebtIndex },
    });
  };

  // const getBill = (billID) => {
  //   axios
  //     .get(`https://4dd7-49-228-165-9.ngrok-free.app/v1/bill/${billID}`, {
  //       headers: {
  //         "ngrok-skip-browser-warning": "3000",
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       convertResponse(response.data.data);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  // const convertResponse = (response) => {
  //   response.debts.forEach((debtData) => {
  //     if (debtData.user_id === currentLineID) {
  //       console.log("matched");
  //       setTotalDebtAmount(debtData.amount);
  //       setBankInfo(response.payment);
  //       // totalDebtAmount = debtData.amount;
  //     }
  //   });
  // };

  // const calculateTotalDebtAmount = (value) => {
  //   let amount = 0;
  //   amount += value.amount;

  //   setTotalDebtAmount(amount);
  //   // totalDebtAmount += value.amount;
  //   setBankInfo(value.payment.bank_info);
  // };

  useEffect(() => {
    console.log("---------updatep--------");
    if (!isLoggedIn) return;
    if (liff.isInClient()) {
      liff.getProfile().then((profile) => {
        console.log(profile);
        setProfile(profile);
        setCurrentLineID(profile.userId);
        if (queryParams.has("fromPersonal")) {
          const query = JSON.parse(queryParams.get("fromPersonal"));
          query.forEach((value) => {
            let amount = 0;
            amount += value.amount;
            setTotalDebtAmount(amount);
            setBankInfo(value.payment.bank_info);
          });
        } else {
          axios
            .get(`https://meekor-be.azurewebsites.net/v1/bill/${billID}`, {
              headers: {
                "ngrok-skip-browser-warning": "3000",
              },
            })
            .then((response) => {
              console.log(response);
              // convertResponse(response.data.data);
              setBill(response.data.data);
              setBillName(response.data.data.name);

              setBankInfo(response.data.data.payment.account_number);
              setBankName(response.data.data.payment.bank_info);
              setAccountName(response.data.data.payment.account_name);

              //see whether user that open is in debt list
              let msgFlag = "loading";
              response.data.data.debts.forEach((debtData, index) => {
                console.log(debtData);

                console.log(
                  "msg == ",
                  message,
                  index,
                  response.data.data.debts.length - 1
                );
                if (debtData.user_id === profile.userId) {
                  console.log("matched");
                  msgFlag = false;
                  // setMessage(false);
                  console.log("set message:", msgFlag);
                  setTotalDebtAmount(debtData.amount);
                  setUserDebtIndex(index);

                  // totalDebtAmount = debtData.amount;
                  if (debtData.status == "pending") {
                    console.log(true);
                    msgFlag = true;
                    setPaidMessage("รอการยืนยันจากเจ้าของบิลก่อนนะคร๊าบ");
                    // setMessage("invalid");
                  }
                  else if (debtData.status == "pending") {
                    console.log(true);
                    msgFlag = true;
                    setPaidMessage("พี่จ่ายบิลนี้ไปแล้วค้าบ");
                  }
                } else if (
                  index == response.data.data.debts.length - 1 &&
                  msgFlag == "loading"
                  // message == "loading"
                ) {
                  msgFlag = true;
                  // setMessage(true);
                  console.log("index = " + index);
                  console.log("invalid");
                }
              });
              setMessage(msgFlag);

              //if promptpay get qr of the promptpay
              if (response.data.data.payment.bank_info == "PromptPay") {
                // axios
                //   .get(
                //     `https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=1236e4750335db77007ca4721f9b9caa&photo_id=${response.data.data.payment.qr_code}&format=json&nojsoncallback=1`
                //   )
                //   .then((res) => {
                //     console.log(res);
                //     const qr_url = res.data.sizes.size[3].source;
                //     setPromptPayQr(qr_url);
                //   })
                //   .catch((err) => {
                //     console.log("Can not get image url");
                //     console.err(err);
                //   });
                setPromptPayQr(response.data.data.payment.qr_code);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    }
  }, [liff, isLoggedIn]);

  return (
    <div>
      {/* <h1> line id = {currentLineID} </h1> */}
      {message === "loading" && (
        <>
          <div class="h-24"></div>
          <div class="flex items-center justify-center w-full h-full">
            <div class="flex justify-center items-center space-x-1 text-sm text-pink-500">
              <svg
                fill="none"
                class="w-12 h-12 animate-spin"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                  fill="currentColor"
                  fill-rule="evenodd"
                />
              </svg>

              <div class=" text-xl">Loading .....</div>
            </div>
          </div>
        </>
      )}
      {message === true && (
        <div className="h-screen w-full cream">
          <div className="font-pink flex w-full h-24 items-center justify-center">
            <h1 className=" text-3xl font-bold ">{billName} </h1>
          </div>
          <div className="w-full h-16 text-center">
            <h1 className="text-xl font-bold ">
              พี่ไม่มีการค้างจ่ายในบิลนี้น้า
            </h1>
            <h1 className="text-xl font-bold ">{paidMessage}</h1>
          </div>
          <div className="flex w-full h-32 mt-16 justify-center">
            <img
              src="https://i.ibb.co/xM6WZjf/bear-2.png"
              alt="bear-2"
              border="0"
            />{" "}
          </div>
        </div>
      )}
      {message === false && (
        <>
          <div className="h-screen w-full cream">
            <div className="flex w-full h-24 items-center ">
              <h1 className=" text-3xl font-bold mt-8 ml-8">{billName} </h1>
            </div>
            <div className="flex justify-center w-full">
              <div className="flex w-5/6 h-16 items-end justify-center border-b-2 border-yellow-900">
                <h1 className="text-4xl font-extrabold ">
                  ฿ {totalDebtAmount}{" "}
                </h1>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <div className="grid grid-cols-2 place-content-between gap-4 w-5/6 h-18  border-b-2 border-yellow-900">
                <div className="left side w-1/2  ">
                  <h3 className="font-medium  text-lg">{bankName} </h3>
                  <h4>{accountName} </h4>
                  <h4 className="font-semibold font-pink text-lg">
                    {bankInfo}
                  </h4>
                </div>
                <div className="right side w-full flex items-center">
                  <button
                    className="mint hover:bg-teal-400 text-white font-bold py-2 px-4 rounded-xl w-full"
                    onClick={() => copyBankInfo()}
                  >
                    คัดลอก
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center"></div>
            <div className="text-center">
              {promptPayQr && (
                <div className="flex justify-center mx-12 my-6">
                  <img className=" " src={promptPayQr} alt="Qr Image" />
                </div>
              )}
              <button
                className="w-3/5 pink hover:bg-pink-400 text-white font-bold py-2 px-4 mt-3 rounded-xl"
                onClick={goToBankTransfer}
              >
                โอนเงินและอัพโหลดสลิป
              </button>
              <button
                className="w-3/5 pink hover:bg-pink-400 text-white font-bold py-2 px-4 mt-3 rounded-xl"
                onClick={goToCashPay}
              >
                จ่ายด้วยเงินสดแล้ว
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-fit h-28 ">
              <svg
                class=" "
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
          </div>
        </>
      )}

      {/* <div className="flex flex-col h-full">
        <div className=" w-screen h-32 min-h-1/5 bg-teal-400"></div>
      </div>
       */}
    </div>
  );
};

export default PaymentPage;
