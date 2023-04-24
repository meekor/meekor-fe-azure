import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AddBankAccount from "./addBankAccount.js";
import AddPromptpayPage from "./addPromptpay.js";
import { useLiff } from "react-liff";
import { useLocation } from "react-router-dom";
import axios from "axios";

const AddAccountPage = () => {
  const location = useLocation();
  console.log("Add account Page state" + JSON.stringify(location.state));
  const billInfo = location.state.bill;

  const userDict = location.state.usersProfile.reduce((acc, item) => {
    acc[item.user_id] = item.display_name;
    return acc;
  }, {});

  console.log(billInfo);

  const [state, setState] = useState({
    accName: "",
    accNum: "",
    bankName: null,
  });

  const { liff } = useLiff();

  const [payUsers, setPayUsers] = useState([]);
  const [paymentType, setPaymentType] = useState(true);
  const [errorMassage, setErrorMassage] = useState("");
  const [accType, setAccType] = useState("bank");

  let date = new Date().toISOString().split("T")[0];

  // console.log("Add acoount Page");

  const validButtonClass =
    "pink py-3 w-1/2 text-white rounded-xl hover:bg-pink-400 drop-shadow-lg";
  const invalidButtonClass =
    "bg-gray-500 hover:border-red-500 w-1/2 py-3 text-white rounded-xl drop-shadow-lg";

  useEffect(() => {
    //add distinct set of member who is consider in this bill
    let users = new Set([]);
    billInfo.itemList.map((item) => {
      item.users.map((member) => {
        users.add(member);
      });
    });
    setPayUsers(Array.from(users));
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    setState({
      ...state,
      [event.target.name]: selectedValue,
    });
  };

  // calculate sum price
  const calSum = () => {
    let sum = 0;
    location.state.bill.itemList.forEach(function (value, i, arr) {
      sum += +value.price;
    });
    return sum;
  };

  function objectLength(obj) {
    var result = 0;
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        // or Object.prototype.hasOwnProperty.call(obj, prop)
        result++;
      }
    }
    return result;
  }
  //=======Find divided price of each item===============================
  const list = [];
  const m = location.state.bill.itemList.forEach(function (entry) {
    const ppm = (Number(entry.price) / Object.keys(entry.users).length).toFixed(
      2
    );
    const a = { id: entry.users, ppm: ppm };
    list.push(a);
  });

  //=======Find dept/person====
  const Deptlist = [];
  const j = payUsers.forEach(function (name) {
    // console.log("payusers " + name);
    let amount = 0;
    const i = list.forEach(function (entry) {
      //const newlist = [];
      //var result = Object.entries(entry.id);
      //console.log("result = " + result);
      //if(entry.id.values.includes(name)){
      // console.log(name + " in " + result);
      //}
      //console.log(Object.values(entry)[0]);
      //console.log("--");
      if (Object.values(entry)[0].includes(name)) {
        amount = amount + Number(entry.ppm);
      }
      amount;
    });
    // console.log(name + " dpm :" + amount);
    const dept = { user_id: name, amount: amount, status: "open" };
    Deptlist.push(dept);
  });

  const findDebt = () => {
    console.log(location.state.bill.itemList);
    const list = [];
    const m = location.state.bill.itemList.forEach(function (entry) {
      console.log(entry.member);
      console.log(Number(entry.price) / Object.keys(entry.member).length);
      const ppm = Number(entry.price) / Object.keys(entry.member).length;
      const a = { id: entry.member, ppm: ppm };
      list.push(a);
    });
    console.log(list);

    const Deptlist = [];

    const j = payUsers.forEach(function (name) {
      console.log("payusers " + name);
      let amount = 0;
      const i = list.forEach(function (entry) {
        //const newlist = [];
        //var result = Object.entries(entry.id);
        //console.log("result = " + result);
        //if(entry.id.values.includes(name)){
        // console.log(name + " in " + result);
        //}
        console.log(Object.values(entry)[0]);
        if (Object.values(entry)[0].includes(name)) {
          amount = amount + Number(entry.ppm);
        }
      });
      console.log(name + " ppm :" + amount);
      const dept = { user_id: name, amount: amount, status: "open" };
      Deptlist.push(dept);
    });

    console.log(Deptlist);
    return Deptlist;
  };

  //TODO save to DB and sent bill to line group chat
  const onSubmit = async () => {
    if (state.accNum.lenght > 13) {
      setErrorMassage("no more than 13 digits");
    }
    console.log(state.accNum);
    let qr_url = "";
    let sum = calSum();

    // ************* need to have group ID this is static***
    // const groupId = "C1fe81d2a7d101b2578259505bd232573";
    // *****************************************************
    let resBillID = "";
    let date = "";
    const groupId = location.state.bill.groupId;

    //connect data
    console.log(Deptlist);
    const billObject = {
      group_id: location.state.bill.groupId,
      name: location.state.bill.billTitle,
      total: sum,
      status: "open",
      owner_id: location.state.bill.owner_id,
      payment: {
        // qr_code: "qr.png",
        bank_info: state.bankName,
        account_name: state.accName,
        account_number: state.accNum,
      },
      debts: Deptlist,
      items: location.state.bill.itemList,
    };
    console.log(billObject);

    //Save to DB....
    // response = {"bill": {bill information},"qr_photo_id": ""}
    await axios
      .post(
        `https://meekor.onrender.com/v1/group/${groupId}/bill`,
        billObject,
        {
          headers: {
            "ngrok-skip-browser-warning": "3000",
          },
        }
      )
      .then((res) => {
        //res return photo id get from upload to imgur
        console.log("loggin result from post bill...");
        console.log(res);
        qr_url = res.data.qr_photo_id;
        resBillID = res.data.bill.id;
        date = new Date(res.data.bill.created_at).toLocaleDateString();
      });

    //send into line
    const userList = Deptlist.map((debt) => {
      return {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: "" + userDict[debt.user_id],
            color: "#FF0000",
          },
          {
            type: "text",
            text: "" + debt.amount.toFixed(2) + " Bath",
            align: "end",
          },
        ],
      };
    });
    console.log(date);
    const message = [
      {
        type: "flex",
        altText: "flex message",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "text",
                text: "หมีขอ",
                wrap: true,
                weight: "bold",
                gravity: "center",
                size: "lg",
              },
              {
                type: "box",
                layout: "vertical",
                margin: "none",
                spacing: "sm",
                contents: [
                  {
                    type: "box",
                    layout: "vertical",
                    spacing: "none",
                    contents: [
                      {
                        type: "text",
                        text: "เรียกเก็บโดย " + billInfo.owner_name,
                        wrap: false,
                        size: "md",
                        color: "#666666",
                        margin: "none",
                      },
                    ],
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    spacing: "none",
                    contents: [
                      {
                        type: "text",
                        text: date,
                        wrap: false,
                        size: "md",
                        color: "#666666",
                        margin: "none",
                      },
                    ],
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: billInfo.billTitle,
                      },
                      {
                        type: "box",
                        layout: "vertical",
                        margin: "lg",
                        spacing: "xs",
                        contents: userList,
                      },
                    ],
                    margin: "md",
                  },
                ],
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "separator",
                    color: "#9F8170",
                    margin: "md",
                  },
                  {
                    type: "text",
                    text: "ดูบิลทั้งหมด",
                    color: "#9F8170",
                    align: "center",
                    action: {
                      type: "uri",
                      label: "action",
                      uri: "http://linecorp.com/",
                    },
                    margin: "md",
                  },
                  {
                    type: "button",
                    action: {
                      type: "uri",
                      label: "จ่ายเงิน",
                      uri:
                        "https://liff.line.me/1657560711-7MgLg4Ld?payment&billId=" +
                        resBillID,
                    },
                    color: "#f2bdcd",
                    style: "primary",
                    margin: "sm",
                  },
                ],
              },
            ],
          },
        },

        // {
        //   type: "bubble",
        //   body: {
        //     type: "box",
        //     layout: "vertical",
        //     contents: [
        //       {
        //         type: "text",
        //         text: "หมีขอ",
        //         margin: "none",
        //         color: "#009900",
        //         size: "sm",
        //       },
        //       {
        //         type: "text",
        //         text: billInfo.billTitle,
        //         weight: "bold",
        //         size: "xxl",
        //         margin: "md",
        //       },
        //       {
        //         type: "text",
        //         text: "เรียกเก็บโดย " + billInfo.owner_name,
        //       },
        //       {
        //         type: "separator",
        //         margin: "lg",
        //       },
        //       {
        //         type: "box",
        //         layout: "vertical",
        //         margin: "lg",
        //         spacing: "xs",
        //         contents: userList,
        //       },
        //     ],
        //   },
        //   footer: {
        //     type: "box",
        //     layout: "vertical",
        //     spacing: "sm",
        //     contents: [
        //       {
        //         type: "button",
        //         style: "primary",
        //         height: "sm",
        //         action: {
        //           type: "uri",
        //           label: "จ่ายเงิน",
        //           uri:
        //             "https://liff.line.me/1657560711-7MgLg4Ld?payment&billId=" +
        //             resBillID,
        //         },
        //       },
        //     ],
        //   },
        // },
      },
    ];

    //send bill summary message
    await liff
      .sendMessages(message)
      .then(() => {
        console.log("message sent");
      })
      .catch((err) => {
        console.log("error sending message liff", err);
      });

    //if it is prompay payment method, send qr code to the group
    if (state.bankName === "PromptPay") {
      //get url from imgur formular
      //----old imgur code--------
      // await axios
      //   .get(
      //     `https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=1236e4750335db77007ca4721f9b9caa&photo_id=${imgur_photo_id}&format=json&nojsoncallback=1`
      //   )
      //   .then((res) => {
      //     const qr_images = res.data.sizes.size;
      //     qr_url = qr_images[3].source;
      //     qr_thumb_url = qr_images[2].source;
      //     console.log(res);
      //   })
      //   .catch((err) => {
      //     console.log("Can not get image url");
      //     console.err(err);
      //   });
      const qr_message = {
        type: "flex",
        altText: "flex message",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            contents: [
              {
                type: "text",
                text: billInfo.billTitle,
                wrap: true,
                weight: "bold",
                gravity: "center",
                size: "xl",
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
                        text: "สร้างบิลสำเร็จแล้ว",
                        wrap: true,
                        size: "sm",
                        color: "#666666",
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
                        text: "สามารถสแกน Qr จ่ายได้เลย",
                        color: "#aaaaaa",
                        size: "sm",
                      },
                    ],
                  },
                ],
              },
              {
                type: "box",
                layout: "vertical",
                margin: "xxl",
                contents: [
                  {
                    type: "image",
                    url: qr_url,
                    aspectMode: "cover",
                    size: "full",
                    margin: "md",
                  },
                ],
              },
            ],
          },
        },
      };

      //send qr code
      await liff
        .sendMessages([qr_message])
        .then(() => {
          console.log("message sent");
        })
        .catch((err) => {
          console.log("error sending message liff", err);
        });
    }

    liff.closeWindow();
  };

  const bankList = [
    {
      value: "SCB",
      label: "ไทยพานิชย์",
      logo: "https://meekor.blob.core.windows.net/misc/SCB.png",
    },
    {
      value: "KBANK",
      label: "กสิกรไทย",
      logo: "https://meekor.blob.core.windows.net/misc/KBANK.png",
    },
    {
      value: "BBL",
      label: "กรุงเทพ",
      logo: "https://meekor.blob.core.windows.net/misc/BBL.png",
    },
    {
      value: "KTB",
      label: "กรุงไทย",
      logo: "https://meekor.blob.core.windows.net/misc/KTB.png",
    },
    {
      value: "BAY",
      label: "กรุงศรี",
      logo: "https://meekor.blob.core.windows.net/misc/BAY.png",
    },
    {
      value: "TTB",
      label: "ทีเอ็มบีธนชาต",
      logo: "https://meekor.blob.core.windows.net/misc/TTB.png",
    },
    {
      value: "KK",
      label: "เกรียตินาคิน",
      logo: "https://meekor.blob.core.windows.net/misc/kk.png",
    },
    {
      value: "TISCO",
      label: "ทิสโก้",
      logo: "https://meekor.blob.core.windows.net/misc/tisco.png",
    },
    {
      value: "CIMBT",
      label: "ซีไอเอมบี",
      logo: "https://meekor.blob.core.windows.net/misc/cimb.png",
    },
    {
      value: "LH",
      label: "แลนด์ แอนด์ เฮ้าส์",
      logo: "https://meekor.blob.core.windows.net/misc/lh.png",
    },
    {
      value: "UOB",
      label: "ยูโอบี",
      logo: "https://meekor.blob.core.windows.net/misc/UOB.png",
    },
    {
      value: "BACC",
      label: "การเกษตรและสหกรณ์",
      logo: "https://meekor.blob.core.windows.net/misc/BAAC.png",
    },
    {
      value: "GSB",
      label: "ออมสิน",
      logo: "https://meekor.blob.core.windows.net/misc/GSB.png",
    },
  ];
  const isDisabled = () => {
    if (state.accName === "" || state.accNum === "") {
      return true;
    }
    return false;
  };

  return (
    <div className="h-screen cream">
      <div>
        <div class="w-full pink h-24 ">
          <h1 class="font-bold text-3xl text-center text-white align-bottom py-6">
            {" "}
            เพิ่มบัญชี
          </h1>
        </div>
        <div class="flex justify-center softpink w-full rounded-b-3xl">
          <button
            className={
              accType == "bank"
                ? "p-3 mr-4 text-red-800 underline underline-offset-2"
                : "p-3 mr-4 hover:text-red-800 "
            }
            onClick={() => {
              setPaymentType(true);
              setAccType("bank");
            }}
          >
            {" "}
            บัญชีธนาคาร{" "}
          </button>
          <button
            className={
              accType == "promptpay"
                ? "p-3 ml-4 text-red-800 underline underline-offset-2 p-3 ml-4"
                : "p-3 ml-4 hover:text-red-800 "
            }
            onClick={() => {
              setPaymentType(false);
              setAccType("promptpay");
              setState({
                ...state,
                bankName: "PromptPay",
              });
            }}
          >
            {" "}
            พร้อมเพย์{" "}
          </button>
        </div>
      </div>
      <div className="flex justify-center mx-5 mb-4">
        {paymentType ? (
          <AddBankAccount
            bankName={state.bankName}
            handleSelectChange={handleSelectChange}
            banklist={bankList}
            accountname={state.accName}
            handlechange={handleChange}
            accountnumber={state.accNum}
          />
        ) : (
          <AddPromptpayPage
            accountname={state.accName}
            accountnumber={state.accNum}
            handlechange={handleChange}
          />
        )}
      </div>
      <div class="flex w-full justify-center">
        <p style={{ color: "red" }}>{errorMassage}</p>
      </div>
      <div class="flex w-full justify-center">
        <button
          class={isDisabled() ? invalidButtonClass : validButtonClass}
          onClick={onSubmit}
          disabled={isDisabled()}
        >
          {" "}
          ยืนยันเก็บเงิน{" "}
        </button>
      </div>
    </div>
  );
};

export default AddAccountPage;
