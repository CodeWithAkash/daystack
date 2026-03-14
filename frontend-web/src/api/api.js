import axios from "axios"

const api = axios.create({
 baseURL:"https://api.day.akash-codes.space"
})

export default api