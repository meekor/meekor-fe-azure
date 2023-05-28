import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLiff } from "react-liff";
import axios from "axios";

const AddMemberPage = () => {
  const [checked, setChecked] = useState([]);
  const navigate = useNavigate();

  // mockData(group members)
  const [checkList, setCheckList] = useState(["Unn", "HB", "Creamder", "gade"]);
  const [usersProfile, setUsersProfile] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId");

  useEffect(() => {
    console.log("yo");
    if (groupId) {
      axios
        .get(`https://meekor-be.azurewebsites.net/v1/group/${groupId}`)
        // .get(`https://meekor.onrender.com/v1/group/${groupId}`)
        .then((res) => {
          console.log(res);
          //res.data.users -> list of user in the group
          setCheckList(res.data.data.users);
          setUsersProfile(res.data.data.users);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  // Add/Remove checked item from list
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  // Generate string of checked items
  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";

  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

  const onSubmit = () => {
    console.log(checkedItems);
    navigate("/equal_bill", {
      state: { checked, groupId, usersProfile },
    });
  };

  const isDisable = () => {
    if (checked.length === 0) {
      return true;
    } else {
      return false;
    }
  };
  const validButton =
    "p-3  pink w-2/3 text-white text-lg rounded-xl drop-shadow-lg ";
  const invalidButton =
    "p-3 w-2/3 text-white text-lg rounded-xl drop-shadow-lg bg-gray-500";

  return (
    <div class=" min-h-screen cream ">
      <div class="flex pink h-28 rounded-b-3xl drop-shadow-sm">
        <h1 class="text-white text-3xl font-bold ml-5 pt-8">
          ใครหารบิลนี้บ้าง?
        </h1>
        <svg
          class="ml-auto my-1 mr-4"
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

      {/* checkbox */}

      <div class="mx-5 mt-5 place-self-start ">
        <div class="font-brown font-semibold text-xl">รายชื่อ:</div>

        {/* item[x] = {display_name: "Hbeat"
        picture_url: ""
        user_id: "U677d217ed6b63f0498e43fc63b2ed898"} */}
        <div class="flex flex-col-reverse divide-y divide-yellow-900  divide-y-reverse  items-stretch">
          {checkList.map((item, index) => (
            <div
              class="flex items-stretch my-3 m-3 font-softbrown font-medium text-xl"
              key={index}
            >
              <input
                value={item.user_id}
                type="checkbox"
                onChange={handleCheck}
                class="w-6 h-6 mt-1 softpink border-gray-300 rounded-full focus:ring-pink-500 focus:ring-2 mr-3"
              />
              <img
                src={item.picture_url}
                className="w-10 h-10 rounded-full drop-shadow-md mb-3 mr-3 self-center"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "https://meekor.blob.core.windows.net/misc/default.jpg";
                }}
              />

              <span
                class="flex font-brown text-xl "
                className={isChecked(item.user_id)}
              >
                {item.display_name}{" "}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* <div class="">{`output test: ${checkedItems}`}</div> */}

      <div class="flex w-full justify-center items-center">
        <button
          type="button"
          className={isDisable() ? invalidButton : validButton}
          disabled={isDisable()}
          onClick={onSubmit}
        >
          ต่อไป
        </button>
      </div>
    </div>
  );
};
export default AddMemberPage;
