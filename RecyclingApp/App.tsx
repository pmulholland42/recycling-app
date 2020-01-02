import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';


import { ScannerScreen } from './screens/ScannerScreen';
import { CheckListScreen } from './screens/CheckListScreen'
import colors from './constants/colors';

const TabNavigator = createBottomTabNavigator(
    {
        ScannerScreen,
        CheckListScreen,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName: string = 'question';
                if (routeName === 'ScannerScreen') {
                    iconName = 'barcode';
                } else if (routeName === 'CheckListScreen') {
                    iconName = 'check-square-o';
                }

                // You can return any component that you like here!
                return <Icon name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: colors.primaryBlue,
            inactiveTintColor: 'gray',
        },
    }
);

export default createAppContainer(TabNavigator);

