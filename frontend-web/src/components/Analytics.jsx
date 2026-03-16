import {useEffect,useState} from "react"
import api from "../api/api"
import {Line} from "react-chartjs-2"

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
} from "chart.js"

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
)

export default function Analytics(){

const [data,setData] = useState([])

useEffect(()=>{

api.get("/analytics/Akash")
.then(res=>{
setData(res.data.history)
})

},[])

const chartData = {
labels: data.map(d=>d.date),
datasets:[
{
label:"Daily Productivity",
data:data.map(d=>d.score),
borderColor:"#DFB6B2",
backgroundColor:"#DFB6B2"
}
]
}

return(

<div className="card">

<h2>Productivity Analytics</h2>

<Line data={chartData}/>

</div>

)

}