import {View,Text,StyleSheet} from "react-native"

export default function ProgressRing({value}){

return(

<View style={styles.circle}>

<Text style={styles.text}>
{value}%
</Text>

</View>

)

}

const styles=StyleSheet.create({

circle:{
width:120,
height:120,
borderRadius:60,
borderWidth:8,
borderColor:"#DFB6B2",
alignItems:"center",
justifyContent:"center"
},

text:{
color:"#FAE5D8",
fontSize:20
}

})