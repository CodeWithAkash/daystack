import {useState,useEffect} from "react"
import {View,Text,StyleSheet} from "react-native"

export default function Timer(){

const [time,setTime]=useState(1500)

useEffect(()=>{

const t=setInterval(()=>{
setTime(prev=>prev-1)
},1000)

return()=>clearInterval(t)

},[])

return(

<View style={styles.container}>

<Text style={styles.timer}>
{Math.floor(time/60)}:{time%60}
</Text>

</View>

)

}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#180018",
alignItems:"center",
justifyContent:"center"
},

timer:{
fontSize:40,
color:"#FAE5D8"
}

})