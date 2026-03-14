import {useEffect,useState} from "react"
import api from "../api/api"

export default function TaskList(){

const [tasks,setTasks]=useState([])
const [checked,setChecked]=useState([])

useEffect(()=>{

api.get("/tasks")
.then(res=>setTasks(res.data))

},[])

function toggle(task){

if(checked.includes(task)){
setChecked(checked.filter(t=>t!==task))
}else{
setChecked([...checked,task])
}

}

return(

<div className="card">

<h2>Tasks</h2>

{tasks.map(t=>(
<div key={t}>

<input
type="checkbox"
onChange={()=>toggle(t)}
/>

{t}

</div>
))}

</div>

)

}