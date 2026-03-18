
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TodoScreen from './src/components/TodoScreen';
import Calendar from './src/components/Calendar';
import HomeScreen from './src/components/HomeScreen';
import DetailScreen from './src/components/DetailScreen';

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