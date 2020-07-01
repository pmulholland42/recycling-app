import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements'

import Item from '../interfaces/Item';
import { getRecyclabilityIcon, isRecyclable } from '../utilities/common';
import styles from '../constants/styles';
import colors from '../constants/colors';
import { fetchItemFromFirestore } from '../utilities/api';

interface Props {
    barcodeData: string,
    closeModal: () => void,
    addItem: () => void,
};
interface State {
    loading: boolean,
    item: Item | null,
};

export class BarcodeInfo extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            item: null,
        }
    }

    componentDidMount() {
        this.checkBarcode(this.props.barcodeData).then(item => {
            this.setState({ loading: false, item });
        })
    }

    async checkBarcode(barcode: string): Promise<Item | null> {
        return fetchItemFromFirestore(barcode);
    }

    render() {
        if (this.state.loading) {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            );
        } else if (this.state.item !== null) {
            var recyclable = isRecyclable(this.state.item.material);
            var recycabilityInfo: string;
            if (recyclable === true) {
                recycabilityInfo = 'This item can be recycled!';
            } else if (recyclable === false) {
                recycabilityInfo = 'This item cannot be recycled.';
            } else {
                recycabilityInfo = 'This item\'s recycability status in your area is unknown.';
            }

            return (
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.headerText}>{this.state.item.name}</Text>
                    {getRecyclabilityIcon(recyclable, 70)}
                    <Text style={styles.headerText}>{recycabilityInfo}</Text>
                    <Button
                            title={'Continue scanning'}
                            onPress={this.props.closeModal}
                            buttonStyle={{
                                backgroundColor: colors.primaryGreen,
                                height: 50,
                            }}
                            titleStyle={{
                                textAlign: 'center'
                            }}
                        />
                </View>
            );
        } else {
            return (
                <View style={{ alignItems: 'center', padding: 10 }}>
                    <Text style={styles.defaultText}>The item you scanned was not found.</Text>
                    <Text style={styles.defaultText}>Would you like to add this item?</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '80%', paddingTop: 20 }}>
                        <Button
                            title={'Cancel'}
                            onPress={this.props.closeModal}
                            buttonStyle={{
                                backgroundColor: 'grey',
                                height: 50,
                            }}
                            titleStyle={{
                                textAlign: 'center'
                            }}
                        />
                        <Button
                            title={'Add item'}
                            onPress={this.props.addItem}
                            buttonStyle={{
                                backgroundColor: colors.primaryGreen,
                                height: 50,
                            }}
                            titleStyle={{
                                textAlign: 'center'
                            }}
                        />
                    </View>
                </View>
            );
        }
    }
}