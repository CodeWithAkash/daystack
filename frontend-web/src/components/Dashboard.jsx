import {useEffect,useState} from "react"
import api from "../api/api"
import ProgressRing from "./ProgressRing"

export default function Dashboard(){

const [streak,setStreak]=useState(0)

useEffect(()=>{

api.get("/streak/Akash")
.then(res=>setStreak(res.data.streak))

},[])

return(

<div className="card">

<h2>Daily Progress</h2>

<ProgressRing value={streak*10}/>

<p>Current Streak: {streak}</p>

</div>

)

}