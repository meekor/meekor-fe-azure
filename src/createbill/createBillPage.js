import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLiff } from "react-liff";

const CreateBillPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState({
    billTitle: "",
    serviceCharge: 0,
    vat: 0,
    discount: 0,
  });
  const [inputList, setinputList] = useState([{ name: "", price: 0.0 }]);

  const [profile, setProfile] = useState({
    userId: "Default",
    displayName: "Default",
  });
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId").replace(/"/g, "");
  // const groupId = queryParams.get("groupId");

  console.log("Geted group Id: " + groupId);

  const { liff, isLoggedIn } = useLiff();

  //---------------------------------------------

  const [validTitle, setValidTitle] = useState(true);
  const validTitleClass =
    "border-2 border-grey-300 hover:border-blue-500  ml-8 mt-2 w-5/6 h-8";
  const invalidTitleClass =
    "bg-red-500 hover:border-red-500  ml-8 mt-2 w-5/6 h-8 ";
  //------------

  const validButtonClass =
    "pink w-2/3 p-2 text-white rounded-lg hover:bg-pink-500";
  const invalidButtonClass =
    "bg-gray-500 hover:border-red-500 w-2/3 p-2 text-white rounded-lg";
  //validButton ? validButtonClass : invalidButtonClass

  useEffect(() => {
    if (!isLoggedIn) return;
    if (liff.isInClient()) {
      liff.getProfile().then((profile) => {
        setProfile(profile);
        console.log(profile);
      });
    }
  }, [liff, isLoggedIn]);

  const passValue = () => {
    navigate("/separate_bill", {
      state: {
        billTitle: state.billTitle,
        itemList: inputList,
        vat: state.vat,
        serviceCharge: state.serviceCharge,
        discount: state.discount,
        owner_id: profile.userId,
        owner_name: profile.displayName,
      },
    });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    console.log(value == 1);
    if (value == "") {
      setValidTitle(false);
    }
    console.log(validTitle);
    setState({
      ...state,
      [event.target.name]: value,
    });
  };

  const handleinputchange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    if (name == "price") {
      list[index][name] = Number.parseFloat(value);
    } else {
      list[index][name] = value;
    }
    setinputList(list);
  };

  const handleremove = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setinputList(list);
  };

  const handleaddclick = () => {
    const x = [...inputList];
    x.push({ name: "", price: 0.0 });
    setinputList(x);
  };

  const isDisabled = () => {
    // console.log("t", state.billTitle);
    // console.log("n", state.name);
    // console.log("p", state.price);
    // console.log("i", inputList);
    //check billtille is not empty
    //yang mai dai change bt color

    if (state.billTitle === "") {
      //alert("");
      return true;
    }
    //check billtille list
    for (let i = 0; i < inputList.length; i++) {
      if (
        inputList[i].name === "" ||
        inputList[i].price === 0.0 ||
        isNaN(inputList[i].price)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      <div className="flex flex-col h-full cream">
        <div className="flex w-screen h-32 min-h-1/5 pink rounded-b-3xl drop-shadow-lg">
          <div className="w-4/6">
            <h1 id="title" className="text-3xl font-bold text-white mt-4 ml-8">
              ชื่อบิล
            </h1>
            <div>
              <input
                name="billTitle"
                value={state.billTitle}
                placeholder="bill Title"
                onChange={handleChange}
                className={validTitle ? validTitleClass : invalidTitleClass}
              />
            </div>
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
        <div className="ml-8 mt-8">
          <h1 className="font-semibold text-xl ">รายการ </h1>
        </div>

        <div>
          {inputList.map((x, i) => {
            // console.log('i==', i)
            return (
              <div key={x} className=" my-3 ml-8">
                <div className="flex items-center w-screen">
                  <div className="w-full mr-1">
                    <input
                      type="text"
                      name="name"
                      className="w-full shadow-inner border-2 border-gray-300 drop-shadow-md rounded-lg p-1"
                      placeholder="รายการ"
                      onChange={(e) => {
                        handleinputchange(e, i);
                      }}
                    />
                  </div>
                  <div className="w-1/2 mx-1">
                    <input
                      type="number"
                      name="price"
                      className="w-full border-2 b shadow-inner border-2 border-gray-300 drop-shadow-md rounded-lg p-1"
                      placeholder="ราคา"
                      onChange={(e) => {
                        handleinputchange(e, i);
                      }}
                    />
                  </div>
                  <div className="w-1/3 ">
                    {inputList.length !== 1 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-red-500"
                        onClick={() => handleremove(i)}
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3 10.5a.75.75 0 000-1.5H9a.75.75 0 000 1.5h6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {inputList.length - 1 === i && (
                  <div>
                    <button
                      className="brown px-4 py-2 rounded-lg drop-shadow-md mt-3 text-white
                      hover:bg-yellow-900 "
                      onClick={handleaddclick}
                    >
                      เพิ่มรายการ
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="my-1 mt-8 items-center w-screen mx-5">
          <div className="flex w-full my-2">
            <h1 className=" w-full p-1 text-lg  ml-3 font-medium">
              Service Charge
            </h1>
            <input
              className="w-1/2 shadow-inner border-2 border-gray-300 drop-shadow-md rounded-lg p-1 mx-1"
              type="number"
              value={state.serviceCharge}
              name="serviceCharge"
              onChange={handleChange}
            />
            <div className="w-1/3" />
          </div>
          <div className="flex w-full my-4 ">
            <h1 className=" w-full ml-3 p-1 text-lg font-medium ">VAT</h1>
            <input
              className="w-1/2 shadow-inner border-2 border-gray-300 drop-shadow-md rounded-lg p-1 mx-1"
              type="number"
              value={state.vat}
              name="vat"
              onChange={handleChange}
            />
            <div className="w-1/3" />
          </div>
          <div className="flex w-full">
            <h1 className=" w-full p-1 text-lg  ml-3 font-medium">ส่วนลด</h1>
            <input
              className="w-1/2 shadow-inner border-2 border-gray-300 drop-shadow-md rounded-lg p-1 mx-1"
              type="number"
              value={state.discount}
              name="discount"
              onChange={handleChange}
            />
            <div className="w-1/3" />
          </div>
        </div>
        <div className="flex justify-center items-end w-full h-full mt-10 mb-8 mr-5">
          <Link
            to={"/separate_bill"}
            state={{
              billTitle: state.billTitle,
              itemList: inputList,
              vat: state.vat,
              serviceCharge: state.serviceCharge,
              discount: state.discount,
              owner_id: profile.userId,
              owner_name: profile.displayName,
              groupId: groupId,
            }}
            className="w-full flex justify-center"
          >
            <button
              className={isDisabled() ? invalidButtonClass : validButtonClass}
              disabled={isDisabled()}
              onClick={passValue}
            >
              ต่อไป
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default CreateBillPage;
