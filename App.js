
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TodoScreen from './TodoScreen';
import Calendar from './Calendar';
import HomeScreen from './HomeScreen';
import DetailScreen from './DetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack cho Home
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Shop Quần Áo" }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: "Chi tiết sản phẩm" }}
      />
    </Stack.Navigator>
  );
}

// function Tabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Todo" component={TodoScreen} />
//       <Tab.Screen name="Calendar" component={Calendar} />
//       <Tab.Screen name="HomeScreen" component={HomeScreen} />
//     </Tab.Navigator>
//   );
// }
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>

        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Todo"
          component={TodoScreen}
        />

        <Tab.Screen
          name="Calendar"
          component={Calendar}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}