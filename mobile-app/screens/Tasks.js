import {View,FlatList} from "react-native"
import TaskItem from "../components/TaskItem"

const tasks=[
"Morning Walk",
"Gardening",
"Coding",
"Painting"
]

export default function Tasks(){

return(

<View>

<FlatList
data={tasks}
renderItem={({item})=><TaskItem task={item}/>}
keyExtractor={(item)=>item}
/>

</View>

)

}