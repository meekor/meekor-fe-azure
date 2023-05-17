import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BillDetails = () => {
  const location = useLocation();
  const [bill, setBill] = useState("");
  const [paid, setPaid] = useState([]);
  const [pending, setPending] = useState([]);
  const [unpaid, setUnpaid] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let bill = location.state.bill.bill;
    console.log(location.state.profiles);
    console.log(bill);

    let paiddebt = [];
    let unpaiddebt = [];
    let pendingdebt = [];

    bill.debts.map((debt) => {
      if (debt.status == "open") {
        unpaiddebt.push(debt);
        setIsVisible(true);
      } else if (debt.status == "pending") {
        pendingdebt.push(debt);
        setIsVisible(true);
      } else if (debt.status == "close") {
        paiddebt.push(debt);
      }
    });

    unpaiddebt.map((debtor) => {
      debtor.items = [];
      let debtorItems = bill.items.filter((item) => {
        return item.users.includes(debtor.user_id);
      });
      debtor.items.push(...debtorItems);
    });

    paiddebt.map((debtor) => {
      debtor.items = [];
      let debtorItems = bill.items.filter((item) => {
        return item.users.includes(debtor.user_id);
      });
      debtor.items.push(...debtorItems);
    });

    pendingdebt.map((debtor) => {
      debtor.items = [];
      let debtorItems = bill.items.filter((item) => {
        return item.users.includes(debtor.user_id);
      });
      debtor.items.push(...debtorItems);
    });

    console.log(unpaiddebt);

    setPaid(paiddebt);
    setPending(pendingdebt);
    setUnpaid(unpaiddebt);
    setBill(bill);
    setProfiles(location.state.profiles);
  }, []);

  const goToPayment = () => {
    const queryString = `?billId=${encodeURIComponent(
      JSON.stringify(bill.id)
    )}`;
    navigate("/payment" + queryString);
  };

  const findOwnerName = (id) => {
    const owner = profiles.find((profile) => profile.user_id === id);
    if (owner) {
      return owner.display_name;
    }
    return null;
  };

  const findProfilePic = (id) => {
    const owner = profiles.find((profile) => profile.user_id === id);
    if (owner) {
      return (
        <img
          src={owner.picture_url}
          className="w-8 h-8 rounded-full drop-shadow-md mb-3 ml-3 mr-3 self-center"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "https://i.ibb.co/GCrgVTT/image-png.jpg";
          }}
        />
      );
    }
    return null;
  };

  let unpaidDiv = (
    <div className="  p-4">
      <h1 className="text-lg font-semibold mb-4">ยังไม่ได้จ่าย</h1>
      {unpaid.map((debtor) => {
        return (
          <div
            key={debtor.user_id}
            className="rounded-xl bg-white drop-shadow-xl p-4 mb-4"
          >
            <h2 className="text-md font-semibold mb-2">
              {findProfilePic(debtor.user_id)}
              {findOwnerName(debtor.user_id)}
            </h2>
            <p className="font-pink mb-2">
              ยอดค้างชำระ: {debtor.amount.toFixed(2)}
            </p>
            <div className=" bg-white  drop-shadow-xl border-t border-yellow-950 pt-2">
              <h3 className="text-sm font-semibold mb-2">
                รายการที่เกี่ยวข้อง
              </h3>
              {debtor.items.map((item) => {
                return (
                  <div key={item.id} className="flex justify-between mb-2">
                    <p>{item.name}</p>
                    <p>
                      ราคาต่อคน: {(item.price / item.users.length).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  let pendingDiv = (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">รอการยืนยัน</h1>
      {pending.map((debtor) => {
        return (
          <div
            key={debtor.user_id}
            className="bg-white rounded-xl drop-shadow-xl  p-4 mb-4"
          >
            <h2 className="text-md font-semibold mb-2">
              {findProfilePic(debtor.user_id)}
              {findOwnerName(debtor.user_id)}
            </h2>
            <p className="font-pink mb-2">
              ยอดค้างชำระ: {debtor.amount.toFixed(2)}
            </p>
            <div className=" bg-white drop-shadow-xl border-t border-yellow-950 pt-2">
              <h3 className="text-sm font-semibold mb-2">
                รายการที่เกี่ยวข้อง
              </h3>
              {debtor.items.map((item) => {
                return (
                  <div key={item.id} className="flex justify-between mb-2">
                    <p>{item.name}</p>
                    <p>
                      ราคาต่อคน: {(item.price / item.users.length).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  let paidDiv = (
    <div className=" p-4">
      <h1 className="text-lg font-semibold mb-4">จ่ายแล้ว</h1>
      {paid.map((debtor) => {
        return (
          <div
            key={debtor.user_id}
            className="bg-white rounded-xl drop-shadow-xl   p-4 mb-4"
          >
            <h2 className="text-md font-semibold mb-2">
              {findProfilePic(debtor.user_id)}

              {findOwnerName(debtor.user_id)}
            </h2>
            <p className="font-pink mb-2">
              ยอดค้างชำระ: {debtor.amount.toFixed(2)}
            </p>
            <div className="bg-white drop-shadow-xl border-t  pt-2">
              <h3 className="text-sm font-semibold mb-2">
                รายการที่เกี่ยวข้อง
              </h3>
              {debtor.items.map((item) => {
                return (
                  <div key={item.id} className="flex justify-between mb-2">
                    <p>{item.name}</p>
                    <p>
                      ราคาต่อคน: {(item.price / item.users.length).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className=" h-full min-h-screen cream w-screen">
      <div class="flex flex-col h-full ">
        <div class="w-screen pink h-20 rounded-b-3xl mb-6">
          <h1 class="font-bold text-3xl text-center text-white align-bottom py-4 ">
            {" "}
            รายละเอียด
          </h1>
        </div>
      </div>
      {unpaid.length !== 0 && <div>{unpaidDiv}</div>}
      {pending.length !== 0 && <div>{pendingDiv}</div>}
      {paid.length !== 0 && <div>{paidDiv}</div>}
      {isVisible && (
        <div className=" w-3/4 ml-6 flex justify-center mb-16">
          <button
            class=" brown rounded-xl p-2  text-white flex justify-center  w-1/3 items-center"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6 stroke-current stroke-1"
            >
              <path
                fill-rule="evenodd"
                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button
            class="pink hover:bg-pink-600 text-white font-bold py-2 rounded-xl w-2/3 ml-6 "
            onClick={goToPayment}
          >
            จ่ายเงิน
          </button>
        </div>
      )}
    </div>
  );
};

export default BillDetails;
