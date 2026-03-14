import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import api from "../api/api"

export default function StreakCard(){

const [streak,setStreak] = useState(0)

useEffect(()=>{

api.get("/streak/Akash")
.then(res=>{
setStreak(res.data.streak)
})

},[])

return(

<motion.div
className="card"
initial={{opacity:0,scale:0.9}}
animate={{opacity:1,scale:1}}
transition={{duration:0.5}}
>

<h2 style={{marginBottom:"10px"}}>🔥 Streak</h2>

<div style={{
fontSize:"42px",
fontWeight:"bold",
color:"#FAE5D8"
}}>

{streak}

</div>

<p style={{
color:"#DFB6B2",
marginTop:"6px"
}}>

Day Consistency

</p>

</motion.div>

)

}