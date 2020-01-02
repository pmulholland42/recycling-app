import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { Scanner } from '../components/Scanner'
import colors from '../constants/colors';

interface Props {};
interface State {
    isScanning: boolean,
};

export class ScannerScreen extends Component<Props, State> {
    static navigationOptions = {
        title: 'Scanner',
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            isScanning: false,
        }

        this.startScanning = this.startScanning.bind(this);
        this.stopScanning = this.stopScanning.bind(this);
    }

    startScanning() {
        this.setState({ isScanning: true });
    }

    stopScanning() {
        this.setState({ isScanning: false });
    }

    render() {
        if (this.state.isScanning) {
            return (
                <Scanner onStopScanning={this.stopScanning}></Scanner>
            );
        } else {
            return (
                <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <View style={{ width: "75%" }}>
                        <Button
                            title={"Press to begin scannning"}
                            onPress={this.startScanning}
                            buttonStyle={{
                                backgroundColor: colors.primaryGreen,
                                height: 100,
                            }}
                            titleStyle={{
                                textAlign: "center"
                            }}
                        />
                    </View>
                </View>
            );
        }
    }
}