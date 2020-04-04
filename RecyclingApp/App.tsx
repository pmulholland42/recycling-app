import React, { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { recyclingReducer, locationReducer } from './redux/reducers';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

import NewItem from './components/NewItem';
import { Scanner } from './components/Scanner';
import CheatSheet from './components/CheatSheet';
import colors from './constants/colors';
import { SET_LOCATION } from './redux/actions';
import { PermissionsAndroid } from 'react-native';

var reducers = combineReducers({ recyclingReducer, locationReducer });
export var store = createStore(reducers);

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
        CheatSheet,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName: string = 'question';
                if (routeName === 'ScannerStack') {
                    iconName = 'barcode';
                } else if (routeName === 'CheatSheet') {
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

const AppContainer = createAppContainer(TabNavigator);

const App = () => {
    const updateLocation = (position: GeolocationResponse) => {
        store.dispatch({
            type: SET_LOCATION,
            payload: {
                location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
            }
        });
        console.log(position.coords.latitude);
    };

    const getLocationPermission = async () => {
        return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: 'RecycleBuddy Location Permission',
            message: 'RecycleBuddy needs access to your location to determine what you can recycle in your area',
            buttonNeutral: 'Not now',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
        });
    }

    // Location tracking
    useEffect(() => {
        getLocationPermission().then(permissionStatus => {
            if (permissionStatus === 'granted') {
                Geolocation.getCurrentPosition(updateLocation);
            }
        });

        Geolocation.watchPosition(updateLocation, error => {
            console.warn(error.message);
        }, {
            useSignificantChanges: true,
        });
    })

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
}

export default App;

