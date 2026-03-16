import {useEffect,useState} from "react"
import api from "../api/api"

export default function TaskList(){

const [tasks,setTasks] = useState([])
const [selected,setSelected] = useState([])

useEffect(()=>{
api.get("/tasks").then(res=>{
setTasks(res.data)
})
},[])

function toggle(task){

if(selected.includes(task)){
setSelected(selected.filter(t=>t!==task))
}else{
setSelected([...selected,task])
}

}

function save(){

api.post("/save-day",{
user:"Akash",
tasks:selected
})

alert("Day saved successfully")

}

return(

<div className="card">

<h2>Daily Checklist</h2>

{tasks.map(task=>(
<div key={task} style={{marginBottom:"8px"}}>

<input
type="checkbox"
onChange={()=>toggle(task)}
/>

<span style={{marginLeft:"10px"}}>
{task}
</span>

</div>
))}

<button
onClick={save}
style={{
marginTop:"12px",
padding:"8px 16px",
borderRadius:"10px",
background:"#824D69",
color:"#FAE5D8",
border:"none"
}}
>
Save Today
</button>

</div>

)

}