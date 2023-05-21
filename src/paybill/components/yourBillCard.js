import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLiff } from "react-liff";
import axios from "axios";

const YourBillCard = ({ bill, userProfiles }) => {
  console.log("in card", bill);
  const location = useLocation();
  const [paid, setPaid] = useState([]);
  const [pending, setPending] = useState([]);
  const [unpaid, setUnpaid] = useState([]);
  const { liff } = useLiff();
  const navigate = useNavigate();

  const remind = async () => {
    const userList = bill.debts.map((debt) => {
      return {
        type: "box",
        layout: "horizontal",
        contents: debt.status=="open" ?  [
          // if debt is not paid
          {
            type: "text",
            text: "@" + findOwnerName(debt.user_id),
            color: "#694d43",
          },
          {
            type: "text",
            text: "" + debt.amount.toFixed(2) + " Bath",
            align: "end",
          },
        ] :
        // if debt is paid or pending then return striking name
        [
          {
            type: "text",
            text: "@" + findOwnerName(debt.user_id),
            color: "#694d43",
            decoration: "line-through"
          },
          {
            type: "text",
            text: "" + debt.amount.toFixed(2) + " Bath",
            align: "end",
            decoration: "line-through",
          },
        ] ,
      };
    });
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
                text: "อย่าลืมจ่ายด้วยนะ",
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
                        text: "เรียกเก็บโดย " + findOwnerName(bill.owner_id),
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
                        text: "บิล " + bill.name,
                        color: "#ff82a7",
                        size: "lg",
                        weight: "bold",
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
                      uri:
                        "https://liff.line.me/1657560711-7MgLg4Ld?summary&groupId=" +
                        bill.group_id,
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
                        bill.id,
                    },
                    color: "#ff82a7",
                    style: "primary",
                    margin: "sm",
                  },
                ],
              },
            ],
          },
        },
      },
    ];

    await liff
      .sendMessages(message)
      .then(() => {
        console.log("message sent");
      })
      .catch((err) => {
        console.log("error sending message liff", err);
      });

    window.alert("ทวงแล้ว");
    window.location.reload(false);
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
  }, [bill]);

  const findOwnerName = (id) => {
    const owner = userProfiles.find((profile) => profile.user_id === id);
    if (owner) {
      return owner.display_name;
    }
    return null;
  };

  const goToConfirm = () => {
    const queryString = `?groupId=${bill.group_id}&billId=${bill.id}`;
    navigate("/confirm" + queryString);
  };

  const goToDetails = () => {
    navigate("/billDetails", {
      state: {
        bill: bill,
        profiles: userProfiles,
      },
    });
  };

  const deleteBill = async () => {
    const confirmDelete = window.confirm("ยืนยันจะลบบิลนี้หรือไม่");

    if (confirmDelete) {
      let date = new Date().toISOString().split("T")[0];

      axios
        .delete(` https://meekor.onrender.com/v1/bill/${bill.id}`, {
          headers: {
            "ngrok-skip-browser-warning": "3000",
          },
        })
        .then((response) => {
          console.log(response);
          convertResponseBill(response.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });

      window.alert("ลบบิลแล้ว");

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
                  text: "บิล " + bill.name + " ยกเลิกการเก็บแล้ว",
                  wrap: true,
                  weight: "bold",
                  gravity: "center",
                  size: "lg",
                  color: "#ff82a7",
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
                          text: "เรียกเก็บโดย " + findOwnerName(bill.owner_id),
                          wrap: false,
                          size: "md",
                          color: "#666666",
                          margin: "none",
                        },
                        {
                          type: "text",
                          text: "ยกเลิกเมื่อ " + date,
                          wrap: false,
                          size: "md",
                          color: "#666666",
                          margin: "none",
                        },
                      ],
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
                        uri:
                          "https://liff.line.me/1657560711-7MgLg4Ld?summary&groupId=" +
                          bill.group_id,
                      },
                      margin: "md",
                    },
                  ],
                },
              ],
            },
          },
        },
      ];

      await liff
        .sendMessages(message)
        .then(() => {
          console.log("message sent");
        })
        .catch((err) => {
          console.log("error sending message liff", err);
        });
    }
    window.location.reload(false);
  };

  return (
    <div>
      <div class="max-w-sm rounded-xl bg-white mb-4  overflow-hidden shadow-lg">
        <div className="flex w-full pink py-6 rounded-b-2xl px-6">
          <h1 className="text-2xl text-white font-bold">บิล {bill.name}</h1>
          <h1 className="text-2xl text-white font-bold ml-auto">
            ฿ {bill.total}
          </h1>
        </div>
        <div class="px-6 py-4">
          <button onClick={goToDetails}>
            {" "}
            <u>ดูรายละเอียด </u>
          </button>
          <div>
            <h1 className="text-lg font-semibold">ยังไม่ได้จ่าย</h1>
            {unpaid.map((debt) => {
              return (
                <div>
                  <h4>
                    {findOwnerName(debt.user_id)} ฿{debt.amount.toFixed(2)}
                  </h4>
                </div>
              );
            })}
            <h1 className="text-lg font-semibold">รอการยืนยัน</h1>
            {pending.map((debt) => {
              return (
                <div>
                  <h4>
                    {findOwnerName(debt.user_id)} ฿{debt.amount.toFixed(2)}
                  </h4>
                </div>
              );
            })}
            <h1 className="text-lg font-semibold">จ่ายแล้ว</h1>
            {paid.map((debt) => {
              return (
                <div>
                  <h4>
                    {findOwnerName(debt.user_id)} ฿{debt.amount.toFixed(2)}
                  </h4>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex w-full justify-center py-2">
              <button
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 w-full rounded mx-2 "
                onClick={deleteBill}
              >
                ยกเลิก
              </button>
              <button
                class="brown hover:bg-yellow-900 text-white font-bold py-2 w-full rounded mx-2"
                onClick={remind}
              >
                ทวงเงิน
              </button>
            </div>

            {pending.length > 0 && (
              <button
                class="mint hover:bg-teal-500 text-white font-bold py-2 mx-2 rounded"
                onClick={goToConfirm}
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
