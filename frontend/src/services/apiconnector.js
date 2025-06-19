import axios from "axios"

export const axiosInstance = axios.create({})

// Set the base URL, method, data for the API to the backend server
export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    })
}