import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams,useLocation } from "react-router-dom";

const PayBillPage = () => {

  const [bill,setBill] = useState("bill name");
  const [price,setPrice] = useState(0);
  const [account, setAccount] = useState("");


  return (
    <div>
      <div class="flex flex-col h-full">
        <div class="flex w-full">
          <h1 class="w-2/4">{bill}</h1>
          <h1 class="w-2/4">{price} บาท</h1>
        </div>
        <h1>Payment Infomation</h1>
        <div class="flex w-full">
          <div class="w-2/4">Account Detail</div>
          <div class="w-2/4">
            <button onclick={()=>{}}>คัดลอก</button>
          </div>
        </div>
        <div>
          <Link to="/qrpay"><button class="w-full">จ่ายด้วย QR</button></Link>
          <Link to="/banktransfer">
          <button class="w-full" onclick={()=>{}}>ส่งสลิปโอนผ่านบัญชี </button>
          </Link>
          <Link to="/cashpay">
          <button class="w-full">จ่ายเงินสด</button></Link>
        </div>
      </div>
    </div>
  );



};



export default PayBillPage;
