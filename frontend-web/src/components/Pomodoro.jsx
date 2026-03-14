import {useState,useEffect} from "react"

export default function Pomodoro(){

const [time,setTime]=useState(1500)

useEffect(()=>{

const t=setInterval(()=>{

setTime(prev=>prev-1)

},1000)

return()=>clearInterval(t)

},[])

return(

<div className="card">

<h3>Pomodoro</h3>

<h1>{Math.floor(time/60)}:{time%60}</h1>

</div>

)

}