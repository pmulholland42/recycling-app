import React, { Component } from 'react';
import { View, Text } from 'react-native';

interface Props {};
interface State {};

export class CheckListScreen extends Component<Props, State> {
    static navigationOptions = {
        title: 'Check List',
    };

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text>
                    CheckList
                </Text>
            </View>
        )
    }
}