import {useState} from "react"

export default function ProgressCircle({label}){

const [done,setDone] = useState(false)

function toggle(){
setDone(!done)
}

return(

<div
onClick={toggle}
style={{
display:"flex",
flexDirection:"column",
alignItems:"center",
cursor:"pointer"
}}
>

<div style={{

width:"120px",
height:"120px",
borderRadius:"50%",
border: done ? "8px solid #DFB6B2" : "8px solid #522959",
display:"flex",
alignItems:"center",
justifyContent:"center",
background:"#2A114B",
boxShadow:"0 10px 30px rgba(0,0,0,0.4)",
transition:"0.3s"

}}>

<span style={{
color:"#FAE5D8",
fontSize:"14px",
textAlign:"center"
}}>

{done ? "✓" : ""}

</span>

</div>

<p style={{
marginTop:"8px",
fontSize:"13px",
textAlign:"center",
color:"#DFB6B2"
}}>

{label}

</p>

</div>

)

}