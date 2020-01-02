import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { RNCamera, FaceDetector } from 'react-native-camera';

import colors from '../constants/colors';

interface Props {};
interface State {};

export class Scanner extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }


    render() {
        return (
            <View>
                <RNCamera captureAudio={false}></RNCamera>
            </View>
        )
    }
}