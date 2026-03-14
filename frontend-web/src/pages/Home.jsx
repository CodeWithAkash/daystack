import Navbar from "../components/Navbar"
import QuoteCard from "../components/QuoteCard"
import StreakCard from "../components/StreakCard"
import TaskList from "../components/TaskList"
import Pomodoro from "../components/Pomodoro"
import Heatmap from "../components/Heatmap"
import Chart from "../components/Chart"
import AIAdvice from "../components/AIAdvice"

export default function Home(){

return(

<div style={{
padding:"20px",
display:"grid",
gap:"20px"
}}>

<Navbar/>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"20px"
}}>

<QuoteCard/>
<StreakCard/>

</div>

<TaskList/>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"20px"
}}>

<Pomodoro/>
<AIAdvice advice="Stay consistent and focus on completing at least 7 tasks daily."/>

</div>

<Chart data={[3,4,5,6,7,8,9]}/>

<Heatmap/>

</div>

)

}