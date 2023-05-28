import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLiff } from "react-liff";

const DebtCard = ({ debtData, userProfiles }) => {
  let owner = debtData.owner_name;
  const [billID, setBillID] = useState([]);
  const navigate = useNavigate();

  // console.log(debtData.bill[0].id);
  // const handleChange = (e) => {
  //   const { value, checked } = e.target;
  //   if (checked) {
  //     setBillID([
  //       ...billID,
  //       {
  //         id: debtData.bill[value].id,
  //         amount: debtData.bill[value].amount,
  //         payment: debtData.payment,
  //       },
  //     ]);
  //   } else {
  //     console.log("state changed");
  //     setBillID(
  //       billID.filter((a) => a.id !== debtData.bill[value].id) //removed uncheck element
  //     );
  //   }
  // };

  const goToPayment = () => {
    const queryString = `?billId=${encodeURIComponent(
      JSON.stringify(debtData.bill.id)
    )}`;
    navigate("/payment" + queryString);
  };

  const goToDetails = () => {
    navigate("/billDetails", {
      state: {
        bill: debtData.bill,
        profiles: userProfiles,
      },
    });
  };

  //Creating UL list components
  let bill_list = (
    <div class="flex ">
      <h1 className="text-xl font-bold"> บิล {debtData.bill.name}</h1>
      <h1 className="text-xl font-pink font-bold ml-auto">
        {" "}
        ฿ {debtData.bill.amount.toFixed(2)}
      </h1>
    </div>
  );

  return (
    <div className="">
      <div class="bg-white max-w-sm rounded-xl mb-5 overflow-hidden shadow-lg">
        <div class="px-6 py-4">
          <div class="w-full  "> {bill_list}</div>
          <h1 className="mt-2 mb-5 text-gray-700">เรียกเก็บโดย @{owner}</h1>
          <div className="w-full flex flex-col justify-center">
            <button onClick={goToDetails}>
              {" "}
              <u>ดูรายละเอียด </u>
            </button>

            <button
              class="pink hover:bg-amber-800 text-white font-bold py-2 rounded mx-5 my-2"
              onClick={goToPayment}
            >
              จ่ายเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtCard;
