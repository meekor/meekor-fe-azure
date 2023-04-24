import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLiff } from "react-liff";

const YourBillCard = ({ bill }) => {
  console.log("in card", bill);
  const location = useLocation();
  const [paid, setPaid] = useState([]);
  const [pending, setPending] = useState([]);
  const [unpaid, setUnpaid] = useState([]);
  const { liff } = useLiff();

  const remind = () => {
    liff
      .sendMessages("#ทวงหน่อย")
      .then(() => {
        console.log("message sent");
      })
      .catch((err) => {
        console.log("error sending message liff", err);
      });
  };

  useEffect(() => {
    let paiddebt = [];
    let unpaiddebt = [];
    let pendingdebt = [];
    bill.debts.map((debt) => {
      if (debt.status == "open") {
        unpaiddebt.push(debt);
      } else if (debt.status == "pending") {
        pendingdebt.push(debt);
      } else if (debt.status == "close") {
        paiddebt.push(debt);
      }
    });
    console.log("Hello", paiddebt, unpaiddebt, pendingdebt);
    setPaid(paiddebt);
    setPending(pendingdebt);
    setUnpaid(unpaiddebt);
  }, []);

  return (
    <div>
      <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <div class="px-6 py-4">
          <div>{bill.name}</div>
          <div class="font-bold text-xl mb-2">฿ {bill.total}</div>
          <div>
            <div>
              <button>
                {" "}
                <u>ดูรายละเอียด </u>
              </button>
            </div>
            <h1>ยังไม่ได้จ่าย</h1>
            {unpaid.map((debt) => {
              return (
                <div>
                  <h4>
                    {debt.user_id} {debt.amount}Baht
                  </h4>
                </div>
              );
            })}
            <h1>รอการยืนยัน</h1>
            {pending.map((debt) => {
              return (
                <div>
                  <h4>
                    {debt.user_id} {debt.amount}Baht
                  </h4>
                </div>
              );
            })}
            <h1>จ่ายแล้ว</h1>
            {paid.map((debt) => {
              return (
                <div>
                  <h4>
                    {debt.user_id} {debt.amount}Baht
                  </h4>
                </div>
              );
            })}
          </div>
          <div>
            <button
              class="bg-red-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {}}
            >
              ยกเลิก
            </button>
            <button
              class="bg-green-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              onClick={remind()}
            >
              ทวงเงิน
            </button>
            {pending.length > 0 && (
              <button
                class="bg-green-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {}}
              >
                {" "}
                ยืนยันสลิป{" "}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourBillCard;
