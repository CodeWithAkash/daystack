import {useState} from "react"
import {CircularProgressbar,buildStyles} from "react-circular-progressbar"
import {motion} from "framer-motion"
import "react-circular-progressbar/dist/styles.css"

export default function HabitCard({label}){

const [progress,setProgress] = useState(0)

function handleClick(){

if(progress === 100){
setProgress(0)
}else{
setProgress(progress + 25)
}

}

return(

<motion.div
whileHover={{scale:1.05}}
whileTap={{scale:0.95}}
className="habit-card"
onClick={handleClick}
>

<div className="progress-wrapper">

<CircularProgressbar
value={progress}
text={`${progress}%`}
styles={buildStyles({
pathColor:"#DFB6B2",
textColor:"#FAE5D8",
trailColor:"#522959"
})}
/>

</div>

<p className="habit-label">{label}</p>

</motion.div>

)

}