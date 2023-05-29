import React, { useState, useEffect } from "react";
import { useLiff } from "react-liff";
import { useParams, useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import storage from "../firebase.js";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import axios from "axios";
// import { BlobServiceClient } from "@azure/storage-blob";
const BankTransferPage = () => {
  const location = useLocation();
  let bill = location.state.bill;
  let date = new Date(bill.created_at).toLocaleDateString();
  const profile = location.state.profile;

  let totalDebtAmount = location.state.totalDebtAmount;
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState();
  const [imgUrl, setImgUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [imageBase64, setImageBase64] = useState("");

  const { liff } = useLiff();
  let bankInfo = "";
  // const imgFile = null;

  // const blobServiceClient = BlobServiceClient.fromConnectionString(
  //   process.env.REACT_APP_AZURE_STORAGE_CONNECTION_STRING
  // );

  const imageUploadHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];

      uploadImage(file)
        .then(() => {
          console.log("Image uploaded successfully");
        })
        .catch((error) => {
          console.log("Error uploading image:", error);
        });

      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const uploadImage = async (file) => {
    console.log("uploading image...");
    setIsUploading(true);

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
          setIsUploading(false);
        });
      }
    );
  };

  // const uploadImage = async (file) => {
  //   const containerClient =
  //     blobServiceClient.getContainerClient("payment-slip");
  //   const blobName = file.name;
  //   console.log(file);
  //   console.log(blobName);
  //   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  //   await blockBlobClient.uploadData(file, {
  //     blobHTTPHeaders: { blobContentType: file.type },
  //   });
  // };

  const calculateTotalDebtAmount = (value) => {
    totalDebtAmount += value.amount;
    bankInfo = value.payment.bank_info;
  };

  // bill.forEach(calculateTotalDebtAmount);
  // console.log(totalDebtAmount);

  // TODO - Implement the backend
  const confirmUpload = async () => {
    console.log("ยืนยัน");
    bill.debts[location.state.userDebtIndex].status = "pending";
    bill.debts[location.state.userDebtIndex].slip = imgUrl;
    console.log(bill);
    console.log("bill id to update:" + bill.id);

    axios
      .put(`https://meekor-be.azurewebsites.net/v1/bill/${bill.id}`, bill, {
        headers: {
          "ngrok-skip-browser-warning": "3000",
        },
      })
      .then((res) => {
        const message = {
          type: "flex",
          altText: "alert bank transfer payment",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: profile.displayName + " จ่ายบิลแล้ว",
                  wrap: true,
                  weight: "bold",
                  gravity: "center",
                  size: "xl",
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
                          text: "อัปโหลดสลิป '" + bill.name + "' " + date,
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
                      type: "button",
                      action: {
                        type: "uri",
                        label: "ตรวจเช็ค",
                        uri:
                          "https://liff.line.me/1657560711-7MgLg4Ld?confirm&billId=" +
                          bill.id +
                          "&groupId=" +
                          bill.group_id,
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
        };
        console.log("succesfully updated bill");
        console.log(res);
        //send bill summary message
        liff
          .sendMessages([message])
          .then(() => {
            console.log("message sent");
            liff.closeWindow();
          })
          .catch((err) => {
            console.log("error sending message liff", err);
          });
      })
      .catch((err) => console.log(err));
  };

  const validConfirmButton =
    "w-3/5 pink hover:bg-pink-400 text-white font-bold py-2 px-4 mt-3 rounded-xl ";
  const invalidConfirmButton =
    "w-3/5 bg-gray-500 hover:bg-gray-500 text-white font-bold py-2 px-4 mt-3 rounded-xl ";
  useEffect(() => {
    console.log(imgUrl);
  }, [imgUrl]);

  return (
    <div className="flex min-h-screen cream">
      <div className="flex flex-col min-h-screen">
        <div class=" flex w-screen h-32 min-h-1/5 pink rounded-b-3xl drop-shadow-md">
          <div class="w-4/6 ">
            <h1 class=" text-3xl font-bold text-white ml-6 mt-10  ">
              โอนเองแล้วส่งสลิป
            </h1>
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
        <div className="flex w-full justify-center ">
          <div className="flex w-full justify-center my-8 mx-8 border-b-2 border-yellow-900 overflow-x-auto">
            <h1 className="text-2xl font-bold mr-3 ">บิล{bill.name}</h1>
            <h1 className="text-2xl font-bold ml-3">฿ {totalDebtAmount}</h1>
          </div>
        </div>

        {isUploading && (
          <div className="flex w-full justify-center m-4">
            <div className="outerbar">
              <div
                className="innerbar"
                style={{ width: `${progresspercent}%` }}
              >
                {progresspercent}%
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <div className="img-container my-4 flex justify-center ">
            {imgUrl && <img src={imgUrl} alt="uploaded file" width={260} />}
          </div>
        </div>

        <div className="flex justify-center w-full">
          <button
            className="w-3/5 mint hover:bg-teal-400 text-white font-bold py-2 px-4 mt-3 rounded-xl"
            onClick={() => imageUploadHandler()}
          >
            อัพโหลดรูป slip
          </button>
        </div>

        <div className="flex justify-center w-full">
          <button
            className={
              imgUrl === null ? invalidConfirmButton : validConfirmButton
            }
            disabled={imgUrl === null ? true : false}
            onClick={() => confirmUpload()}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankTransferPage;
