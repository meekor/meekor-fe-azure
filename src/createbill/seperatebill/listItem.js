import { useLocation } from "react-router-dom";
import Sheet from "react-modal-sheet";
import styled from "styled-components";
import axios from "axios";
import React, { useState, useEffect, useRef, createRef } from "react";
const ListItem = ({ passedData, passToParent, sendUserProfile }) => {
  const location = useLocation();
  console.log(location);
  const groupId = location.state.groupId;
  const list = passedData;

  const [isOpen, setOpen] = useState(false);
  // "users": [
  //   {
  //     "user_id": "U677d217ed6b63f0498e43fc63b2ed898",
  //     "display_name": "Hbeat",
  //     "picture_url": ""
  //   },
  //   {
  //     "user_id": "assadasdsakddo212o312o31p",
  //     "display_name": "asd",
  //     "picture_url": "link.com"
  //   },
  // ]
  const [memberlist, setMemberlist] = useState([]);
  const [userDict, setUserDict] = useState({});
  //check box handling
  const [checked, setChecked] = useState([]);
  const [itemIndex, setItemIndex] = useState();

  //manage and add member button
  const memberElementsRef = useRef(list.map(() => createRef()));

  useEffect(() => {
    // add property member to item list
    list.forEach(function (e) {
      e.users = [];
    });
    //old pull api
    console.log("pullllll");
    axios
      .get(`https://meekor.onrender.com/v1/group/${groupId}`, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((response) => {
        console.log(response);
        console.log("Yeahhh finish get data from be");
        let dict = {};
        response.data.data.users.forEach((user) => {
          dict[user.user_id] = user.picture_url;
        });
        setMemberlist(response.data.data.users);
        sendUserProfile(response.data.data.users);
        setUserDict(dict);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // const checkList = ["Unn", "HB", "Creamder", "gade"];
  // mock all member members data
  /*const memberlist = [
    {
      name: 'un',
      id: '124',
      pic: '/dsfs',
    },
    {
      name: 'HB',
      id: '123',
      pic: '/dsfs',
    },
    {
      name: 'Der',
      id: '234',
      pic: '/dsfs',
    },
    {
      name: 'Gade',
      id: '134',
      pic: '/dsfs',
    },
  ];*/

  const open = (idx) => {
    setOpen(true);
    setItemIndex(idx);
  };

  const close = () => {
    setOpen(false);
    // clear select
    list[itemIndex].users = checked;

    memberChange(itemIndex);

    setChecked([]);
    setItemIndex(null);

    console.log("list with new update ");
    console.log(list);
    passToParent(list);
  };

  // Add/Remove checked item from list
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    console.log("updated list" + updatedList);
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
  };

  //Display member UI according to change
  const memberChange = (index) => {
    console.log("memberref:::", memberElementsRef.current[index].current);

    //clear old member list of that item
    memberElementsRef.current[index].current.innerHTML = null;
    //map updated member to div
    list[index].users.map((lm) => {
      // create button -> <button class="p-3 bg-pink-300 rounded-full m-1">{lm}</button>;
      const memberBtn = document.createElement("img");
      memberBtn.src = userDict[lm];
      memberBtn.className =
        "w-10 h-10 rounded-full drop-shadow-md mb-3 ml-3 mr-3 self-center border-gray-200";
      memberBtn.onError = ({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        currentTarget.src = "https://i.ibb.co/GCrgVTT/image-png.jpg";
      };

      console.log(userDict[lm]);
      // memberBtn.innerText = userDict[lm];
      //add to that div by useRef
      memberElementsRef.current[index].current.appendChild(memberBtn);
    });
    console.log(memberElementsRef.current[index].current);
  };

  return (
    <div className="mx-1">
      <span>
        {list.map((l, index) => (
          <div class="bg-white mx-5 mb-2 drop-shadow-xl rounded-xl">
            <div class="flex w-full">
              <input class="p-2 m-2 w-2/4 text-lg" value={l.name} />
              <input
                class="p-2 ml-auto mt-2 mb-2 w-1/5  text-lg mr-4  text-right"
                value={l.price}
              />
            </div>
            <div class="flex justify-between">
              {/* show member for a list*/}
              <div className="flex ">
                <div
                  ref={memberElementsRef.current[index]}
                  // className={`item-member-${index}`}
                  className="flex "
                ></div>
              </div>

              {/* button add member */}
              <button
                class=" p-1 bright-green rounded-full mx-4 mb-2 w-10 h-10"
                onClick={() => open(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6 text-white"
                >
                  <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </span>
      <Sheet
        rootId="root"
        isOpen={isOpen}
        onClose={close}
        snapPoints={[-50, 0.5, 200, 0]}
        initialSnap={2}
      >
        <Sheet.Container>
          <Sheet.Header />

          <Sheet.Content>
            <BoxList>
              {memberlist.map((member, index) => (
                <div className="flex flex-col divide-y-4 divide-slate-600">
                  <div
                    className="flex items-stretch my-3 m-3 font-medium text-lg"
                    key={index}
                  >
                    <input
                      value={member.user_id}
                      type="checkbox"
                      onChange={handleCheck}
                      className="mt-2"
                    />
                    <img
                      src={member.picture_url}
                      className="w-8 h-8 rounded-full drop-shadow-md mb-3 ml-3 mr-3 self-center"
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src =
                          "https://i.ibb.co/GCrgVTT/image-png.jpg";
                      }}
                    />
                    <span className={isChecked(member.user_id)}>
                      {member.display_name}
                    </span>
                  </div>
                  <hr className="divider" />
                </div>
              ))}
            </BoxList>
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
};
const BoxList = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  padding-top: 0px;
  overflow: auto;
  border-bottom: 2px solid #67473c`;

const Box = styled.div`
  background-color: #eee;
  border-radius: 12px;
  min-height: 200px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
`;
export default ListItem;
