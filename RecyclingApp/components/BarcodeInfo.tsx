import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements'

import NewItem from './NewItem'
import Item from '../interfaces/Item';
import getRecyclablityIcon from '../utilities/Common';
import styles from '../constants/styles';
import colors from '../constants/colors';

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
        return null; /*{
            name: 'Folger\'s Noir Golden Dusk Instant Coffee',
            type: {
                materialType: 'glass',
                name: 'Clear glass',
                isRecyclable: true,
            },
        };*/
    }

    render() {
        if (this.state.loading) {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            );
        } else if (this.state.item) {
            var recycabilityInfo: string;
            if (this.state.item.type.isRecyclable === true) {
                recycabilityInfo = 'This item can be recycled!';
            } else if (this.state.item.type.isRecyclable === false) {
                recycabilityInfo = 'This item cannot be recycled.';
            } else {
                recycabilityInfo = 'This item\'s recycability status in your area is unknown.';
            }

            return (
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.headerText}>{this.state.item.name}</Text>
                    {getRecyclablityIcon(this.state.item.type.isRecyclable, 70)}
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