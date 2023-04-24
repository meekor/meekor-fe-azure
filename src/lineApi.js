import axios from "axios";
import React, { useState, useEffect } from "react";

export const getUserProfile = async (groupId, userId) => {
  console.log("LineApi");
  console.log();

  await axios
    .get(
      `https://api.line.me/v2/bot/group/C1fe81d2a7d101b2578259505bd232573/member/Ud0e3ad49a338181491978b30f11ea069`,
      {
        headers: {
          Authorization: `Bearer SlWNN6qNCXJDYVN2nMpMU/RQCdCmXMwY5HfU02xrfN5OoQyRWpWYv0DOYRg6FXQjcs34/BWKDOt/A/fTmuvxpsQtrr5WxxZMwtYJnGm80LuMm7650vvHB+BRDktpsObQA56ly8yci/n4DG5TYdvZGwdB04t89/1O/w1cDnyilFU=`,
        },
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
