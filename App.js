
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TodoScreen from './src/components/TodoScreen';
import Calendar from './src/components/Calendar';
import HomeScreen from './src/components/HomeScreen';
import DetailScreen from './src/components/DetailScreen';
import RealTimeClock from './src/components/RealTimeClock'
import AlarmScreen from './src/components/AlarmScreen'
import StopwatchScreen from './src/components/StopwatchScreen'
import CountdownScreen from './src/components/CountdownScreen'

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

function ClockTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name='Đồng hồ' component={RealTimeClock}/>
      <Tab.Screen name='Báo thức' component={AlarmScreen}/>
      <Tab.Screen name='Đồng hồ bấm giờ' component={StopwatchScreen}/>
      <Tab.Screen name='Đếm ngược' component={CountdownScreen}/>
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>

        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="TodoTab"
          component={TodoScreen}
        />

        <Tab.Screen
          name="CalendarTab"
          component={Calendar}
        />
        <Tab.Screen name="ClockTab" component={ClockTabs}/>

      </Tab.Navigator>
    </NavigationContainer>
  );
}