import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements'

import Item from '../interfaces/Item';
import { getRecyclabilityIcon, isRecyclable } from '../utilities/common';
import styles from '../constants/styles';
import colors from '../constants/colors';
import { fetchItemFromFirestore } from '../utilities/api';

interface Props {
    /** The scanned barcode */
    barcodeData: string,
    closeModal: () => void,
    addItem: () => void,
};
interface State {
    loading: boolean,
    /** The scanned item, or null if it's unknown */
    item: Item | null,
};

/**
 * If a barcode is already in our database, this shows the info about the item.
 * If not, this prompts the user to to add the item.
 */
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

    /**
     * Tries to find this barcode in the database.
     * If the barcode is found, returns the item. Otherwise returns null.
     * @param barcode 
     */
    async checkBarcode(barcode: string): Promise<Item | null> {
        return fetchItemFromFirestore(barcode);
    }

    render() {
        if (this.state.loading) { // Item info is still loading
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            );
        } else if (this.state.item !== null) { // The item info is already in our database
            let recyclable = isRecyclable(this.state.item.material);
            let recycabilityInfo: string;
            if (recyclable === true) {
                recycabilityInfo = 'This item can be recycled!';
            } else if (recyclable === false) {
                recycabilityInfo = 'This item cannot be recycled.';
            } else {
                recycabilityInfo = 'This item\'s recycability status in your area is unknown.';
            }

            return (
                <View style={{ alignItems: 'center' }}>
                    {/* Item info */}
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
        } else { // The item is not yet in our database
            // TODO: make sure the user is logged in before allowing them to add items
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