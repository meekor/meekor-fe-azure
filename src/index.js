import React, { useState, useEffect } from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { LiffProvider } from "react-liff";

import "./style.css";
// import App from "./liffApp";
import CreateBillPage from "./createbill/createBillPage.js";
import SeperateBill from "./createbill/seperatebill/seperateBillPage";
import AddAccountPage from "./createbill/addaccount/addAccountPage.js";
import AddPromptpayPage from "./createbill/addaccount/addPromptpay.js";
import PersonalBillPage from "./paybill/personalBillPage.js";
import PaymentPage from "./paybill/paymentPage.js";
import PayBillPage from "./paybill/payBillPage.js";
import BankTransferPage from "./paybill/bankTransferPage.js";
import CashPayPage from "./paybill/cashPayPage.js";
import EqualBillPage from "./createEqualBill/equalBillPage.js";
import ConfirmPage from "./confirmPage.js";
import ConfirmbillPage from "./confirmbillPage.js";
import AddMemberPage from "./createEqualBill/addMemberpage.js";
import RedirectUrl from "./redirectUrl.js";
import NotFound from "./notFoundPage.js";
import BillDetails from "./paybill/billDetails.js";

const liffId = "1657560711-7MgLg4Ld";
const stubEnabled = false;

const container = document.getElementById("root");
// container.classList.add("no-scroll");
// document.body.classList.add("no-scroll");
const root = createRoot(container);
root.render(
  <LiffProvider liffId={liffId} stubEnabled={stubEnabled}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectUrl />} />
        {/* <Route path="/" element={<CreateBillPage />} /> */}
        {/* <Route path="/" element={<AddMemberPage />} /> */}
        {/* <Route path="/" element={<PayBillPage />} /> */}
        {/* <Route path="/" element={<ConfirmPage />} /> */}
        {/* <Route path="/" element={<PaymentPage />} /> */}
        {/* <Route path="/" element={<PersonalBillPage />} /> */}
        {/* <Route path="/" element={<ConfirmbillPage />} /> */}

        <Route path="/summary" element={<PersonalBillPage />} />

        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/create_bill" element={<CreateBillPage />} />
        <Route path="/confirm_bill" element={<ConfirmbillPage />} />
        <Route path="/add_member" element={<AddMemberPage />} />
        <Route path="/separate_bill" element={<SeperateBill />} />
        {/* problem location */}

        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/personal" element={<PersonalBillPage />} />

        <Route path="/add_account" element={<AddAccountPage />} />
        <Route path="/add_promptpay" element={<AddPromptpayPage />} />

        <Route path="/banktransfer" element={<BankTransferPage />} />
        <Route path="/cashpay" element={<CashPayPage />} />
        <Route path="/billDetails" element={<BillDetails />} />

        <Route path="/equal_bill" element={<EqualBillPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </LiffProvider>
);
