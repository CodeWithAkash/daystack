import {NavigationContainer} from "@react-navigation/native"
import {createStackNavigator} from "@react-navigation/stack"

import Dashboard from "./screens/Dashboard"
import Tasks from "./screens/Tasks"
import Timer from "./screens/Timer"

const Stack=createStackNavigator()

export default function App(){

return(

<NavigationContainer>

<Stack.Navigator>

<Stack.Screen
name="Dashboard"
component={Dashboard}
/>

<Stack.Screen
name="Tasks"
component={Tasks}
/>

<Stack.Screen
name="Timer"
component={Timer}
/>

</Stack.Navigator>

</NavigationContainer>

)

}