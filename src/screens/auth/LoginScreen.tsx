import {View, Text} from 'react-native';
import React from 'react';
import ButtonComponent from '../../components/ButtonComponent';

const LoginScreen = () => {
  return (
    <View>
      <Text>LoginScreen</Text>
      <ButtonComponent text="Login" type="primary" />
    </View>
  );
};

export default LoginScreen;
