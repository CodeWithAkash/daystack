import {Bar} from "react-chartjs-2"
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js"

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
)

export default function Chart({data}){

const chartData={
labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
datasets:[
{
label:"Tasks Completed",
data:data,
backgroundColor:"#DFB6B2"
}
]
}

return(
<div className="card">
<Bar data={chartData}/>
</div>
)

}