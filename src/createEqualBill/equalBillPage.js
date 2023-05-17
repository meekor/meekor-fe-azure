import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLiff } from "react-liff";
import axios from "axios";

const EqualBillPage = () => {
  const location = useLocation();
  console.log("EqualBill Page state" + JSON.stringify(location.state));
  const selectedMember = location.state.checked;
  const groupId = location.state.groupId;
  const usersProfile = location.state.usersProfile;

  const [debtorList, setdebtorList] = useState([]);
  const [allChanged, setAllChanged] = useState(false);

  const [billName, setBillName] = useState();
  const [billTotal, setBillTotal] = useState(null);
  const [billType, setBillType] = useState("nullTotal");

  const [profile, setProfile] = useState({
    userId: "Default",
    displayName: "Default",
  });
  const { liff, isLoggedIn } = useLiff();

  useEffect(() => {
    if (!isLoggedIn) return;
    liff.ready.then(() => {
      if (liff.isInClient()) {
        liff.getProfile().then((profile) => {
          console.log(profile);
          setProfile(profile);
        });
      }
    });
  }, [liff, isLoggedIn]);

  useEffect(
    () => {
      axios
        .get(`https://meekor-be.azurewebsites.net/v1/group/${groupId}`, {
          headers: {
            "ngrok-skip-browser-warning": "3000",
          },
        })
        .then((response) => {
          console.log(response);
          console.log("debtorList:", debtorList);
          const dict = response.data.data.users.reduce((acc, item) => {
            acc[item.user_id] = item.display_name;
            return acc;
          }, {});
          console.log("dict", dict);
          selectedMember.forEach((member) => {
            setdebtorList((current) => [
              ...current,
              {
                name: dict[member],
                userID: member,
                price: 0.0,
                priceChanged: false,
              },
            ]);
          });
        })
        .catch(function (error) {
          console.log(error);
        });

      // const mockUserID = ["111", "222", "333", "444"];
      // let i = 0;
    },
    [
      //  liff, isLoggedIn
    ]
  );

  const handleDebtChange = (event, userID) => {
    if (allChanged) {
      let sum1 = 0;
      const allChangedList = debtorList.map((debtor) => {
        if (debtor.userID == userID) {
          sum1 += parseFloat(event || 0);
          return {
            ...debtor,
            price: parseFloat(event || 0),
            priceChanged: true,
          };
        } else {
          sum1 += debtor.price;
          return debtor;
        }
      });
      setBillTotal(sum1);
      setdebtorList(allChangedList);

      return 0;
    }
    if (parseFloat(event || 0) > billTotal) {
      //TODO--- show modal alert "ไม่สามารถใส่เงินเกินยอดบิลได้"
      console.log(
        "case: inputเกินยอดรวม - respond: ไม่สามารถใส่เงินเกินยอดบิลได้"
      );

      setBillTotal(parseFloat(event || 0));
      const tempList = debtorList.map((debtor) => {
        if (debtor.userID == userID) {
          return {
            ...debtor,
            price: parseFloat(event || 0),
            priceChanged: true,
          };
        } else {
          return {
            ...debtor,
            price: 0,
            priceChanged: false,
          };
        }
      });
      setdebtorList(tempList);

      return 0;
    }

    let newTotal = billTotal - parseFloat(event || 0);
    let changedDebt = 0;
    let newDebtor = 0;

    const newList = debtorList.map((debtor) => {
      if (debtor.userID == userID) {
        changedDebt += parseFloat(event || 0);

        return {
          ...debtor,
          price: parseFloat(event || 0),
          priceChanged: true,
        };
      } else if (!debtor.priceChanged) {
        newDebtor++;
        return debtor;
      } else {
        newTotal -= debtor.price;
        return debtor;
      }
    });
    if (newDebtor == 0) {
      setAllChanged(true);
    }

    // check if entered price make sum debt is over billTotal if YES then alert user
    const newDebtPerOne = newTotal / newDebtor;
    if (newDebtPerOne < 0) {
      //TODO --- Show modal alert "ไม่สามารถใส่เงินเกินยอดรวมบิลได้"
      console.log(
        "case: inputทำให้sumDebtเกินยอดรวม -- respond: ไม่สามารถใส่เงินเกินยอดรวมบิลได้"
      );

      return 0;
    }

    const updatedList = newList.map((debtor) => {
      if (debtor.priceChanged) {
        return debtor;
      } else if (!debtor.priceChanged || newDebtor == 0) {
        return { ...debtor, price: newDebtPerOne };
      }
    });
    setdebtorList(updatedList);
  };

  const changeDebtFirstHandler = (event, userID) => {
    let sum = 0;
    const tempList = debtorList.map((debtor) => {
      if (debtor.userID == userID) {
        sum += parseFloat(event);
        return { ...debtor, price: parseFloat(event) };
      } else {
        sum += debtor.price;
        return debtor;
      }
    });
    setBillTotal(sum.toFixed(2));
    setdebtorList(tempList);
  };

  const handleChange = (event, inUserID) => {
    if (billType == "notNullTotal") {
      handleDebtChange(event, inUserID);
      return 0;
    } else if (billType == "nullTotal") {
      changeDebtFirstHandler(event, inUserID);
      return 0;
    } else {
      return "error";
    }
  };

  const equalDivideHandler = (event) => {
    setAllChanged(false);

    setBillTotal(parseFloat(event));
    setBillType("notNullTotal");
    const debtPerOne = event / Object.keys(debtorList).length;
    const newList = debtorList.map((debtor) => {
      return { ...debtor, price: debtPerOne, priceChanged: false };
    });
    setdebtorList(newList);
  };

  const onSubmit = () => {
    console.log(billName, billTotal, debtorList);
  };

  const formValidaition = () => {
    if (!billName || isNaN(billTotal)) {
      // TODO --- alert modal "กรอกข้อมูลไม่ครบ"
      console.log("Form is invalid");
      return true;
    } else {
      return false;
    }
  };

  return (
    <div class="flex flex-col cream min-h-screen">
      <div class=" flex w-screen h-32 min-h-1/5 pink rounded-b-3xl drop-shadow-md">
        <div class="w-4/6 ">
          <h1
            for="billTitle"
            class=" text-3xl font-bold text-white ml-6 mt-4  "
          >
            ชื่อบิล
          </h1>

          <input
            type="text"
            id="billTitle"
            name="billTitle"
            value={billName}
            placeholder=" ชื่อบิลของคุณ"
            onChange={(event) => setBillName(event.target.value)}
            class=" ml-6 mt-2 rounded-lg w-full h-8 p-3 "
          />
        </div>
        <svg
          class=" ml-auto my-2 mr-4 "
          fill="#694D43"
          height="91px"
          width="91px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-61.44 -61.44 634.88 634.88"
          transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"
          stroke="#000000"
          stroke-width="0.00512"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#CCCCCC"
            stroke-width="1.024"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M217.592,177.33c-9.281-4.843-15.688-11.31-15.542-21.778c0-29.971-24.296-54.267-54.267-54.267 s-54.267,24.297-54.267,54.267c0.297,10.065-4.255,17.641-12.911,22.785c-20.12,11.958-35.002,41.52-35.002,51.807 c0,29.971,24.296,54.267,54.267,54.267c3.697,0,7.307-0.37,10.796-1.074c24.648-4.978,49.649-4.931,74.303,0.015 c3.467,0.695,7.054,1.061,10.726,1.061c29.971,0,54.268-24.296,54.268-54.267C249.964,213.29,237.001,187.458,217.592,177.33z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M209.187,0.451c-18.792-4.414-41.67,24.543-46.084,43.337c-4.415,18.791,7.24,37.605,26.034,42.019 c18.792,4.414,37.606-7.241,42.02-26.034C235.571,40.981,227.979,4.866,209.187,0.451z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M274.937,83.318c-17.01-3.996-37.717,22.216-41.713,39.225c-3.996,17.01,6.555,34.038,23.565,38.034 c17.01,3.996,34.038-6.555,38.034-23.565C298.819,120.002,291.947,87.313,274.937,83.318z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M132.476,43.787c-4.413-18.792-27.291-47.75-46.083-43.336C67.6,4.866,60.008,40.98,64.422,59.772 c4.414,18.793,23.228,30.449,42.02,26.035C125.234,81.393,136.89,62.58,132.476,43.787z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M63.819,122.543c-3.996-17.01-24.702-43.221-41.713-39.225C5.096,87.314-1.775,120.002,2.22,137.013 c3.996,17.01,21.024,27.56,38.034,23.565C57.265,156.582,67.814,139.554,63.819,122.543z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M432.548,404.918c-9.281-4.843-15.688-11.31-15.542-21.778c0-29.971-24.296-54.267-54.267-54.267 s-54.267,24.296-54.267,54.267c0.297,10.065-4.255,17.641-12.911,22.785c-20.12,11.958-35.002,41.52-35.002,51.807 c0,29.971,24.296,54.267,54.267,54.267c3.697,0,7.307-0.37,10.796-1.074c24.648-4.978,49.649-4.931,74.303,0.015 c3.467,0.695,7.054,1.061,10.726,1.061c29.971,0,54.267-24.296,54.267-54.267C464.92,440.878,451.957,415.046,432.548,404.918z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M424.143,228.039c-18.792-4.414-41.67,24.543-46.084,43.337c-4.414,18.791,7.242,37.605,26.034,42.019 c18.792,4.414,37.606-7.241,42.02-26.034C450.527,268.568,442.935,232.453,424.143,228.039z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M489.893,310.906c-17.01-3.996-37.717,22.216-41.713,39.225c-3.996,17.009,6.555,34.038,23.565,38.034 c17.01,3.996,34.038-6.555,38.034-23.565C513.775,347.59,506.903,314.901,489.893,310.906z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M347.433,271.374c-4.414-18.792-27.291-47.751-46.084-43.336c-18.792,4.415-26.384,40.53-21.97,59.323 c4.414,18.792,23.227,30.448,42.02,26.034C340.191,308.979,351.847,290.167,347.433,271.374z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M278.775,350.131c-3.996-17.01-24.703-43.221-41.713-39.225c-17.01,3.996-23.882,36.684-19.887,53.694 c3.995,17.01,21.024,27.56,38.034,23.565C272.221,384.169,282.77,367.141,278.775,350.131z"></path>{" "}
              </g>{" "}
            </g>{" "}
          </g>
        </svg>
      </div>
      <div>
        {/* total bill amount */}
        <div class="mx-3">
          <h1 for="billTotal" class="p-2 ml-2 font-semibold text-xl mt-6">
            ยอดรวมบิล
          </h1>
          <input
            class="p-1 ml-4 border-2 border-gray-300 drop-shadow-md rounded-lg"
            type="number"
            onWheel={(e) => e.target.blur()}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            value={billTotal}
            placeholder="ยอดรวมของบิลนี้"
            onChange={(event) =>
              equalDivideHandler(parseInt(event.target.value))
            }
          ></input>
        </div>
        {/* display array of debtor */}
        <h1 class="p-2 ml-5 mt-6 text-xl font-semibold drop-shadow-md">
          {" "}
          ยอดแต่ละคน{" "}
        </h1>
        <div class="ml-5 mt-6 text-lg drop-shadow-md">
          {debtorList.map((debtor, i) => {
            return (
              <div key={i} class="grid grid-cols-2 gap-3 m-3">
                <span class="p-2" key={i}>
                  {debtor.name}
                </span>
                <input
                  class="p-1 border-2 border-gray-300 rounded-xl w-1/2 ml-auto mr-10"
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  // onKeyPress={(event) => {
                  //   if (!/[0-9]/.test(event.key)) {
                  //     event.preventDefault();
                  //   }
                  // }}
                  value={debtor.price.toFixed(2)}
                  defaultValue={debtor.price.toFixed(2)}
                  onChange={(event) => {
                    handleChange(event.target.value, debtor.userID);
                  }}
                ></input>
              </div>
            );
          })}
        </div>
      </div>
      <div class="flex justify-center w-screen">
        <Link
          to="/add_account"
          class="w-3/4 flex justify-center"
          state={{
            // TODO:----- pass billInfo to addAccount page
            bill: {
              billTitle: billName,
              itemList: [{ name: "", price: billTotal, users: selectedMember }],
              vat: 0,
              serviceCharge: 0,
              discount: 0,
              owner_id: profile.userId,
              owner_name: profile.displayName,
              groupId: location.state.groupId,
            },
            usersProfile: location.state.usersProfile,
          }}
        >
          <button
            class="w-2/3 p-3 px-10 pink my-16 rounded-xl drop-shadow-md hover:bg-pink-500 disabled:bg-gray-300 text-white"
            // note: disable works fine but style on tailwind is not
            disabled={!billName || isNaN(billTotal)}
            onClick={() => onSubmit()}
          >
            เพิ่มบัญชี
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EqualBillPage;
