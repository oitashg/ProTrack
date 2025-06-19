import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { contestEndpoints } from "../apis";

const { FETCH_ALL_CONTESTS_API } = contestEndpoints;

// Function to fetch all contests from the API
export const fetchAllContests = async () => {
  let result = [];
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("GET", FETCH_ALL_CONTESTS_API);
    console.log("Fetch all contests API response : ", response);

    if (!response?.status) {
      throw new Error("Could not fetch contests");
    }

    toast.success("Contests fetched Successfully");
    result = response?.data;
  } 
  catch (error) {
    console.log("Error fetching contests:", error);
    toast.error("Could Not fetch contests");
  }
  toast.dismiss(toastId);
  return result;
};
