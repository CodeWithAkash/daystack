import {useEffect,useState} from "react"
import api from "../api/api"

export default function Heatmap(){

const [data,setData]=useState([])

useEffect(()=>{

api.get("/heatmap/Akash")
.then(r=>setData(r.data))

},[])

return(

<div className="card">

<h3>Habit Heatmap</h3>

{data.map(d=>(
<div key={d.date}>
{d.date} : {d.count}
</div>
))}

</div>

)

}