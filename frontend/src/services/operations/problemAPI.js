import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { problemEndpoints } from "../apis";

const { FETCH_ALL_PROBLEMS_API } = problemEndpoints;

// Function to fetch all problems from the API
export const fetchAllProblems = async () => {
  let result = [];
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("GET", FETCH_ALL_PROBLEMS_API);
    console.log("Fetch all problems API response : ", response);

    if (!response?.status) {
      throw new Error("Could not fetch problems");
    }

    toast.success("Problems fetched Successfully");
    result = response?.data;
  } 
  catch (error) {
    console.log("Error fetching problems:", error);
    toast.error("Could Not fetch problems");
  }

  toast.dismiss(toastId);
  return result;
};
