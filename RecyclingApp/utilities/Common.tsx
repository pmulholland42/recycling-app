import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../constants/colors'
import { StyleProp, TextStyle } from 'react-native';

export default function getRecyclabilityIcon(isRecyclable: boolean | undefined, size: number, style?: StyleProp<TextStyle>) {
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