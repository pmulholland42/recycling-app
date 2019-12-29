import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

import colors from '../constants/colors';

interface Props {};
interface State {};

export class ScannerScreen extends Component<Props, State> {
    static navigationOptions = {
        title: 'Scanner',
    };

    constructor(props: Props) {
        super(props);
        this.scan = this.scan.bind(this);
    }

    scan() {
        console.warn("scanning");
    }

    render() {
        return (
            <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
                <View style={{ width: "75%" }}>
                    <Button
                        title={"Press to begin scannning"}
                        onPress={this.scan}
                        buttonStyle={{
                            backgroundColor: colors.primaryBlue,
                            height: 100,
                        }}
                        titleStyle={{
                            textAlign: "center"
                        }}
                    />
                </View>
            </View>
        )
    }
}