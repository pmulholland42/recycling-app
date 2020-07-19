import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../constants/colors'
import Material from '../interfaces/Material';
import { store } from '../redux/store';
import AsyncStorage from '@react-native-community/async-storage';

// Miscellaneous utlity functions

/**
 * Returns the checkmark, X, or question mark icon for a material
 * @param isRecyclable Is the material recyclable? If undefined, returns the ? icon
 * @param size Size of the icon
 * @param style (optional) Style passed to the icon.
 */
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

/**
 * Gets the display data for a material (e.g. 'Plastic #4 - Low-Density Polyethylene (LDPE)')
 * @param material 
 */
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

/**
 * Checks if a material is recyclable
 * @param material 
 * @returns true if recyclable, false if not, undefined if unknown
 */
export function isRecyclable(material: Material): boolean | undefined {
    var recyclabilityMap = store.getState().recyclingReducer.recyclabilityMap;
    return recyclabilityMap.get(material.id);
}

/**
 * Converts an async network request function into a cached async function. 
 * The first time this is called, it will make the network request.
 * The returned data is then stored locally for future calls.
 * @param apiCall The async function to cachify. The return data must be must be JSON serializable.
 * @param storageKey A unique string for this function, used to store and retrieve the request data locally.
 * @returns An async function with the same signature as the real async function.
 */
export function cachify<T extends (...args: any[]) => Promise<any>>(apiCall: T, storageKey: string) {
    return function(...args: Parameters<T>): ReturnType<T> {
        return AsyncStorage.getItem(storageKey).then(localData => {
            if (localData == null) {
                return apiCall(...args).then(fetchedData => {
                    AsyncStorage.setItem(storageKey, JSON.stringify(fetchedData));
                    return fetchedData;
                });
            } else {
                return JSON.parse(localData);
            }
        }) as ReturnType<T>
    }
}