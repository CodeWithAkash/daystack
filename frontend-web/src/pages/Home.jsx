import Navbar from "../components/Navbar"
import QuoteCard from "../components/QuoteCard"
import StreakCard from "../components/StreakCard"
import TaskList from "../components/TaskList"
import Heatmap from "../components/Heatmap"
import Analytics from "../components/Analytics"
import AIAdvice from "../components/AIAdvice"
import HabitGrid from "../components/HabitGrid"

export default function Home(){

return(

<div style={{padding:"25px"}}>

<Navbar/>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"20px",
marginTop:"20px"
}}>

<QuoteCard/>
<StreakCard/>

</div>

<div style={{marginTop:"20px"}}>

<HabitGrid/>

</div>

<div style={{marginTop:"20px"}}>

<TaskList/>

</div>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"20px",
marginTop:"20px"
}}>

<Analytics/>
<AIAdvice advice="Consistency builds powerful habits."/>

</div>

<div style={{marginTop:"20px"}}>

<Heatmap/>

</div>

</div>

)

}