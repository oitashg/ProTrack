import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";

const {
  ADD_STUDENT_API,
  EDIT_STUDENT_API,
  DELETE_STUDENT_API,
  FETCH_ALL_STUDENTS_API,
  TOGGLE_EMAIL_SETTING_API,
} = studentEndpoints;

//Note:
//The data that is passed to the API functions from the frontend is
//actually again send to the backend inside apiConnector function
//and then in the backend , those datas are extracted from req.body

//Function to add a new student via API
export const addStudent = async (data) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("POST", ADD_STUDENT_API, data);
    console.log("Add student API response : ", response);

    if (!response?.status) {
      throw new Error("Could not add student");
    }

    toast.success("Student added Successfully");
    result = response?.data;
  } 
  catch (error) {
    console.log("Error adding student:", error);
    toast.error("Could Not add student");
  }
  toast.dismiss(toastId);
  return result;
};

//Function to edit an existing student via API
export const editStudent = async (data) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("POST", EDIT_STUDENT_API, data);
    console.log("Edit student API response : ", response);

    if (!response?.status) {
      throw new Error("Could not edit student");
    }

    toast.success("Student edited Successfully");
    result = response?.data;
  } 
  catch (error) {
    console.log("Error editing student:", error);
    toast.error("Could Not edit student");
  }
  toast.dismiss(toastId);
  return result;
};

//Function to delete a student via API
export const deleteStudent = async (studentId) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  console.log("Student ID to delete: ", studentId);
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_STUDENT_API}/${studentId}`,
    );
    console.log("Delete student API response : ", response);

    if (!response?.status) {
      throw new Error("Could not delete student");
    }

    toast.success("Student delete Successfully");
    result = response?.data;
  } 
  catch (error) {
    console.log("Error deleting student:", error);
    toast.error("Could Not delete student");
  }
  toast.dismiss(toastId);
  return result;
};

//Function to fetch all students from the API
export const fetchAllStudents = async () => {
  let result = [];
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("GET", FETCH_ALL_STUDENTS_API);
    console.log("Fetch all students API response : ", response);

    if (!response?.status) {
      throw new Error("Could not fetch students");
    }

    toast.success("Students fetched Successfully");
    result = response?.data;
    console.log("Result -> ", result)
  } 
  catch (error) {
    console.log("Error fetching students:", error);
    toast.error("Could Not fetch students");
  }

  toast.dismiss(toastId);
  return result;
};

//Function to toggle email setting for a student via API
export const toggleEmailSetting = async (id, isOff) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector(
      "POST",
      TOGGLE_EMAIL_SETTING_API,
      {id,isOff}
    );
    console.log("Toggle email setting API response : ", response);

    if (!response?.status) {
      throw new Error("Could not toggle email setting");
    }

    toast.success("Email setting toggled Successfully");
    result = response?.data;
  } 
  catch (error) {
    console.log("Error toggling email setting:", error);
    toast.error("Could Not toggle email setting");
  }
  
  toast.dismiss(toastId);
  return result;
};
