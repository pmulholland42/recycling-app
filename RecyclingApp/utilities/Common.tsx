import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../constants/colors'
import { StyleProp, TextStyle } from 'react-native';
import Material from 'interfaces/Material';

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