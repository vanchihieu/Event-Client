import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerCustom from '../components/DrawerCustom';
import TabNavigator from './TabNavigator';
import EventNavigator from './EventNavigator';
import MapNavigator from './MapNavigator';

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
      }}
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={props => <DrawerCustom {...props} />}>
      <Drawer.Screen name="HomeNavigator" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
