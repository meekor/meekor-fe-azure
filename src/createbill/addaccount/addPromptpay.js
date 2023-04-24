import React, { useState } from "react";
const AddBankAccount = ({ accountname, handlechange, accountnumber }) => {
  return (
    <div class="w-full grid grid-flow-row auto-rows-max p-5">
      <h1 className= "mt-4 text-lg text-medium"> ชื่อบัญชี</h1>
      <input
        class=" p-2 my-3 drop-shadow-xl shadow-inner rounded-xl"
        placeholder="ชื่อบัญชี"
        type="text"
        name="accName"
        value={accountname}
        onChange={handlechange}
      />
      <h1 className= "mt-4 text-lg text-medium"> เลขพร้อมเพย์</h1>
      <input
        class=" p-2 my-3 drop-shadow-xl shadow-inner rounded-xl"
        placeholder="เลขบัญชี"
        type="number"
        name="accNum"
        value={accountnumber}
        onChange={handlechange}
      />
    </div>
  );
};
export default AddBankAccount;
