import React, { useState } from "react";
import Select, { components } from "react-select";

const { Option } = components;
const IconOption = (props) => (
  <Option {...props}>
    <div className="flex">
      <img src={props.data.logo} style={{ width: 28 }} alt={props.data.label} />
      <label className="ml-2">{props.data.label}</label>
    </div>
  </Option>
);

const AddBankAccount = ({
  bankName,
  handleSelectChange,
  banklist,
  accountname,
  handlechange,
  accountnumber,
}) => {
  return (
    <div class="w-full h-full grid grid-flow-row auto-rows-max p-5">
      <h1 className="mt-6 text-lg text-medium">บัญชีธนาคาร </h1>

      <Select
        defaultValue={banklist[0]}
        options={banklist}
        components={{ Option: IconOption }}
        onChange={handleSelectChange}
      />

      {/* <select
        class="block p-2 my-2 w-full bg-white border-0 border-b-2  appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 "
        name="bankName"
        value={bankName}
        onChange={handleSelectChange}
        placeholder="กรุณาเลือกธนาคาร"
      >
        {banklist.map((option) => (
          <option value={option.value} data-thumbnail={option.logo}>
            {option.label}{" "}
          </option>
        ))}
      </select> */}

      <h1 className="mt-4 text-lg text-medium"> ชื่อบัญชี</h1>
      <input
        class=" p-2 my-3 drop-shadow-xl shadow-inner rounded-xl"
        placeholder="ชื่อบัญชี"
        type="text"
        name="accName"
        value={accountname}
        onChange={handlechange}
      />
      <h1 className="mt-4 text-lg text-medium"> เลขบัญชี</h1>
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
