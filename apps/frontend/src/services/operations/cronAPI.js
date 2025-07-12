import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { cronEndpoints } from "../apis";

const { SET_CRON_TIME_API, GET_CRON_TIME_API } = cronEndpoints;

// Function to set cron time via API
export const setCronTimeAPI = async (data) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  console.log("Sent data: ", data);

  try {
    const response = await apiConnector("POST", SET_CRON_TIME_API, data);
    console.log("Set cron time API response : ", response?.data?.data);

    if (!response?.status) {
      throw new Error("Could not set cron time");
    }

    toast.success("Cron time set Successfully");
    result = response?.data?.data;
  } 
  catch (error) {
    console.log("Error setting cron time:", error);
    toast.error("Could Not set cron time");
  }

  toast.dismiss(toastId);
  return result;
};

// Function to get cron time via API
export const getCronTimeAPI = async () => {
  let result = [];
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("GET", GET_CRON_TIME_API);
    console.log("Get cron time API response : ", response?.data[0]);

    if (!response?.status) {
      throw new Error("Could not fetch cron time");
    }

    toast.success("Cron time fetched Successfully");
    result = response?.data[0];
  } 
  catch (error) {
    console.log("Error getting cron time:", error);
    toast.error("Could Not fetch cron time");
  }

  toast.dismiss(toastId);
  return result;
};