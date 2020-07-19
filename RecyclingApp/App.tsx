import React, { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Provider } from 'react-redux';
import { LatLong } from './interfaces/LatLong';
import { store } from './redux/store';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

import NewItem from './components/NewItem';
import { Scanner } from './components/Scanner';
import CheatSheet from './components/CheatSheet';
import colors from './constants/colors';
import { PermissionsAndroid } from 'react-native';
import { getLocation, getRecyclabilityInfo, addLocation } from './utilities/api';
import { getMaterials } from './utilities/api';
import { setMaterials, setLocation, setPosition, setRecyclabilityMap } from './redux/actionCreators';

getMaterials().then(materials => {
    store.dispatch(setMaterials(materials))
});

//addLocation('d23c7ba1e4c92a9544fde37bc4bf11a9ebd2adfe', 'Pittsburgh');

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
    const updateLocation = async (position: GeolocationResponse) => {
        // Update GPS position
        let newPosition: LatLong = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }
        store.dispatch(setPosition(newPosition));

        // TODO: move these side effects to the setPosition action creator function?

        // Update location
        let newLocation = await getLocation(newPosition);
        let oldLocationId = store.getState().locationReducer.location.id;
        store.dispatch(setLocation(newLocation));

        // If the user moved locations, update recyclability info
        if (oldLocationId !== newLocation.id) {
            let recyclabilityMap = await getRecyclabilityInfo(newLocation.id);
            store.dispatch(setRecyclabilityMap(recyclabilityMap));
        }
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

