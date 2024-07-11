import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {LoginScreen} from '../screens';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      {/* <Stack.Screen name="SignUpScreen" component={SignUpScreen} /> */}
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
