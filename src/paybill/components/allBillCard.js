import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLiff } from "react-liff";

const DebtCard = ({ debtData, userProfiles }) => {
  let owner = debtData.owner_name;
  const [billID, setBillID] = useState([]);
  const navigate = useNavigate();

  //Creating UL list components
  let bill_list = (
    <div class="flex ">
      <h1 className="text-xl font-bold"> บิล {debtData.bill.name}</h1>
      <h1 className="text-xl font-pink font-bold ml-auto">
        {" "}
        ฿ {debtData.bill.amount}
      </h1>
    </div>
  );

  const goToDetails = () => {
    navigate("/billDetails", {
      state: {
        bill: debtData,
        profiles: userProfiles,
      },
    });
  };

  useEffect(() => {}, [billID]);

  return (
    <div>
      <div class="bg-white max-w-sm rounded-xl mb-5 overflow-hidden shadow-lg">
        <div class="px-6 py-4">
          <div class="w-full  "> {bill_list}</div>
          <h1 className="mt-2 mb-5 text-gray-700">เรียกเก็บโดย @{owner}</h1>
          <div className="w-full flex flex-col justify-center">
            <button onClick={goToDetails}>
              {" "}
              <u>ดูรายละเอียด </u>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtCard;
