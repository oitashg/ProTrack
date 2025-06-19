const BASE_URL = import.meta.env.VITE_APP_BASE_URL

//student endpoints
export const studentEndpoints = {
    ADD_STUDENT_API: `${BASE_URL}/student/add`,
    EDIT_STUDENT_API: `${BASE_URL}/student/edit`,
    DELETE_STUDENT_API: `${BASE_URL}/student/delete`,
    FETCH_ALL_STUDENTS_API: `${BASE_URL}/student/getAllStudents`,
    TOGGLE_EMAIL_SETTING_API: `${BASE_URL}/student/toggleEmail`,
}

//contest endpoints
export const contestEndpoints = {
    FETCH_ALL_CONTESTS_API: `${BASE_URL}/contest/getAllContests`,
}

//problem endpoints
export const problemEndpoints = {
    FETCH_ALL_PROBLEMS_API: `${BASE_URL}/problem/getAllProblems`,
}

//cron endpoints
export const cronEndpoints = {
    SET_CRON_TIME_API: `${BASE_URL}/cron/setCronTime`,
    GET_CRON_TIME_API: `${BASE_URL}/cron/getCronTime`,
}