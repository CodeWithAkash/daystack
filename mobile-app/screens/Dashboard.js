import {View,Text,StyleSheet} from "react-native"

export default function Dashboard(){

return(

<View style={styles.container}>

<Text style={styles.title}>DayStack</Text>

<Text style={styles.streak}>🔥 Streak 5</Text>

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

title:{
fontSize:34,
color:"#FAE5D8"
},

streak:{
fontSize:22,
color:"#DFB6B2"
}

})