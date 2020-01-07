import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import ModalSelector from 'react-native-modal-selector'

import Item from '../interfaces/Item';
import styles from '../constants/styles';
import RecyclingType from 'interfaces/RecyclingType';

interface Props {
    barcode: string,
};
interface State {
    name: string,
    type: RecyclingType | null,
};

export class NewItem extends Component<Props, State> {


    constructor(props: Props) {
        super(props);

        this.state = {
            name: "",
            type: null,
        }
    }

    render() {

        return (
            <View style={{ padding: 20 }}>
                <Text style={styles.headerText}>Add a new item</Text>
                <Text style={styles.defaultText}>Name of item:</Text>
                <TextInput
                    style={styles.textBox}
                    placeholder={'ie. Dasani water'}
                    value={this.state.name}
                    onChangeText={name => { this.setState({ name }) }}
                />

                <Text style={styles.defaultText}>Material type:</Text>
            </View>
        )
    }
}