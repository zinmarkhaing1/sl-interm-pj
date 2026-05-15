// import axios from "axios";

// export const api_key = "";
// // const token = localStorage.getItem('token');
// export const api = axios.create({
// //   baseURL: "https://YOUR_REAL_ID.mockapi.io/api/v1",
//     baseURL: "https://6a04973d2afe8349b4b6e0db.mockapi.io/",
  
//   headers: {
//     "Content-Type": "application/json",
//     // Authorization : `Bearer ${token}`,
//   },
// });

import axios from 'axios'
export const api = axios.create({
  baseURL :'http://localhost:5000'
})