import {motion} from "framer-motion"

export default function ProgressRing({value}){

return(

<motion.div
animate={{rotate:360}}
transition={{repeat:Infinity,duration:8}}
style={{
width:120,
height:120,
borderRadius:"50%",
border:"8px solid #DFB6B2"
}}
>
{value}%
</motion.div>

)

}