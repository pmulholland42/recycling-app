import React, { Component } from 'react';
import { View, Text } from 'react-native';

interface Props {};
interface State {};

export class ScannerScreen extends Component<Props, State> {
    static navigationOptions = {
        title: 'Scanner',
    };

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text>
                    Scanner
                </Text>
            </View>
        )
    }
}