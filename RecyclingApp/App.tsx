import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';


import { NewItem } from './components/NewItem';
import { Scanner } from './components/Scanner'
import { CheckListScreen } from './screens/CheckListScreen'
import colors from './constants/colors';

const ScannerStack = createStackNavigator({
    Scanner,
    NewItem,
}, {
    headerMode: 'none',
});
ScannerStack.navigationOptions = {
    title: 'Scanner',
}

const TabNavigator = createBottomTabNavigator(
    {
        ScannerStack,
        CheckListScreen,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName: string = 'question';
                if (routeName === 'ScannerStack') {
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
            inactiveTintColor: '#A9A9A9',
        },
    }
);

export default createAppContainer(TabNavigator);

