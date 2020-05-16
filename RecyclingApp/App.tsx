import React, { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { recyclingReducer, locationReducer, Location } from './redux/reducers';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

import NewItem from './components/NewItem';
import { Scanner } from './components/Scanner';
import CheatSheet from './components/CheatSheet';
import colors from './constants/colors';
import { SET_LOCATION, SET_LOCATION_NAME } from './redux/actions';
import { PermissionsAndroid } from 'react-native';
import { getLocationName } from './utilities/common';
import { getMaterials } from './utilities/api';
import { setMaterials } from './redux/actionCreators';

var reducers = combineReducers({ recyclingReducer, locationReducer });
export const store = createStore(reducers);

getMaterials().then(materials => {
    store.dispatch(setMaterials(materials))
});

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
        let newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }
        store.dispatch({
            type: SET_LOCATION,
            payload: {
                location: newLocation
            }
        });
        getLocationName(newLocation).then(locationName => {
            store.dispatch({
                type: SET_LOCATION_NAME,
                payload: {
                    locationName,
                }
            })
        });
    };

    const getLocationPermission = async () => {
        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: 'RecycleBuddy Location Permission',
            message: 'RecycleBuddy needs access to your location to determine what you can recycle in your area',
            buttonNeutral: 'Not now',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
        }).catch(error => {
            console.warn(`Error requesting location permission: ${error}`);
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
    }, []);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
}


export default App;

