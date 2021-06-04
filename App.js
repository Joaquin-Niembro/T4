/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Table, {Create, Show, Update} from './T';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="T" component={Table} />
        <Stack.Screen name="create" component={Create} />
        <Stack.Screen name="show" component={Show} />
        <Stack.Screen name="update" component={Update} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
