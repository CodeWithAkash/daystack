import {useEffect,useState} from "react"
import api from "../api/api"

export default function QuoteCard(){

const [quote,setQuote]=useState("")

useEffect(()=>{

api.get("/quote")
.then(r=>setQuote(r.data.quote))

},[])

return(

<div className="card">

{quote}

</div>

)

}