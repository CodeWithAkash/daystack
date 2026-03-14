import {View,Text,Switch} from "react-native"
import {useState} from "react"

export default function TaskItem({task}){

const [checked,setChecked]=useState(false)

return(

<View>

<Text>{task}</Text>

<Switch
value={checked}
onValueChange={()=>setChecked(!checked)}
/>

</View>

)

}