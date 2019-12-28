import React, { Component } from 'react';
import { View, Text } from 'react-native';

interface Props {};
interface State {};

export class ScannerScreen extends Component<Props, State> {
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