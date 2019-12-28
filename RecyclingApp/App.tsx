import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { ScannerScreen } from './screens/ScannerScreen';
import { CheckListScreen } from './screens/CheckListScreen'

const TabNavigator = createBottomTabNavigator({
    ScannerScreen,
    CheckListScreen,
})

export default createAppContainer(TabNavigator);

