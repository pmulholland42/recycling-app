import React, { Component } from 'react';
import { View, Text } from 'react-native';

import Item from '../interfaces/Item';

interface Props {
    barcode: string,
};
interface State {
};

export class NewItem extends Component<Props, State> {


    constructor(props: Props) {
        super(props);
    }

    render() {

        return (
            <View>
                <Text>Add a new item:</Text>

            </View>
        )
    }
}