import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../constants/colors'
import { StyleProp, TextStyle } from 'react-native';
import Material from 'interfaces/Material';
import { store } from '../redux/store';
import { Location } from '../redux/reducers';
import { apiKey } from '../apiKey';

export function getRecyclabilityIcon(isRecyclable: boolean | undefined, size: number, style?: StyleProp<TextStyle>) {
    let iconName: string;
    let iconColor: string;
    if (isRecyclable === true) {
        iconName = 'check';
        iconColor = colors.secondaryGreen;
    } else if (isRecyclable === false) {
        iconName = 'ban';
        iconColor = colors.orange;
    } else {
        iconName = 'question';
        iconColor = 'black';
    }

    return (
        <Icon name={iconName} size={size} color={iconColor} style={style}/>
    );
}

export function getMaterialDescription(material: Material): string {
    let description: string;
    if (material.plasticNumber) {
        description = `Plastic #${material.plasticNumber} - ${material.name}`;
    } else {
        description = material.name;
    }
    if (material.code) {
        description += ` (${material.code})`;
    }
    return description;
}

export function isRecyclable(material: Material): boolean | undefined {
    var recyclabilityMap = store.getState().recyclingReducer.recyclabilityMap;
    return recyclabilityMap.get(material.id);
}

export function getLocationName(location: Location): Promise<string> {
    console.log('getting location name...');
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=1&key=${apiKey}`;
    return fetch(url).then(response => response.json()).then(data => {
        return data.results[0].name;
    });
}