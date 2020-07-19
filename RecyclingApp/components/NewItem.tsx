import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-elements'
import ModalSelector, { IOption } from 'react-native-modal-selector';
import { connect } from 'react-redux';
import { NavigationStackProp } from 'react-navigation-stack';
import memoize from 'memoize-one';

import styles from '../constants/styles';
import Material from '../interfaces/Material';
import { GlobalState } from '../redux/reducers';
import { getMaterialDescription } from '../utilities/common';
import colors from '../constants/colors';
import { addItem } from '../utilities/api';

interface NewItemParams {
    /** The barcode that was scanned for the new item */
    barcode: string,
}

interface Props {
    navigation: NavigationStackProp<NewItemParams>,
    /** Materials list */
    materials: Material[],
};
interface State {
    /** The name of the item entered in the text box */
    itemName: string,
    /** The id of the material selected in the modal selector */
    materialId: string | null,
};

/**
 * Screen that allows the user to create a new item.
 * Prompts the user for the name and material type of their item.
 */
class NewItem extends Component<Props, State> {

    defaultMaterialOption = 'Select material type';

    constructor(props: Props) {
        super(props);

        this.state = {
            itemName: '',
            materialId: null,
        }

        this.onDonePress = this.onDonePress.bind(this);
        this.onCancelPress = this.onCancelPress.bind(this);
    }

    /**
     * Called when the done button is pressed
     */
    async onDonePress() {
        if (this.state.materialId !== null) {
            await addItem(this.state.itemName, this.state.materialId, this.props.navigation.getParam('barcode'))
            this.props.navigation.navigate('Scanner');
        }
    }

    /**
     * Called when the cancel button is pressed
     */
    onCancelPress() {
        this.props.navigation.navigate('Scanner');
    }

    /**
     * Get the options for the modal selector
     */
    getModalOptions = memoize((materials: Material[]): IOption[] => {
        // Material types are the broader categories of materials, like glass and plastic
        let materialTypes: string[] = [];
        materials.forEach(material => {
            if (!materialTypes.includes(material.type)) {
                materialTypes.push(material.type);
            }
        })

        let modalOptions: IOption[] = [];
        materialTypes.forEach(materialType => {
            // Add the material type as a section header
            modalOptions.push({
                key: materialType,
                section: true,
                label: materialType,
            });

            // Add all the materials of this type as options
            modalOptions = modalOptions.concat(materials.filter(material => {
                return material.type === materialType;
            }).map(material => {
                return {
                    key: material.id,
                    label: getMaterialDescription(material),
                }
            }));
        });

        return modalOptions;
    })

    render() {

        const modalOptions = this.getModalOptions(this.props.materials);

        return (
            <View style={{ padding: 20, justifyContent: 'space-between' }}>

                <View>
                    <Text style={styles.headerText}>Add a new item</Text>

                    {/* Item name textbox */}
                    <Text style={styles.defaultText}>Name of item:</Text>
                    <TextInput
                        style={styles.textBox}
                        placeholder={'e.g. Dasani water bottle'}
                        value={this.state.itemName}
                        onChangeText={itemName => { this.setState({ itemName }) }}
                    />

                    {/* Material modal selector */}
                    <Text style={styles.defaultText}>Material:</Text>
                    <ModalSelector
                        style={{ paddingTop: 20 }}
                        data={modalOptions}
                        initValue={this.defaultMaterialOption}
                        onChange={option => this.setState({ materialId: option.key as string })}
                    >
                    </ModalSelector>
                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 30 }}>
                    {/* Cancel button */}
                    <Button
                        title={'Cancel'}
                        style={{ flex: 1 }}
                        buttonStyle={{ backgroundColor: 'grey' }}
                        onPress={this.onCancelPress}
                    />
                    {/* Done button */}
                    <Button
                        title={'Done'}
                        disabled={ this.state.itemName.length === 0 || this.state.materialId === null }
                        style={{ flex: 1 }}
                        buttonStyle={{ backgroundColor: colors.primaryGreen }}
                        onPress={this.onDonePress}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state: GlobalState) => {
    return {
        materials: state.recyclingReducer.materials,
    };
}
export default connect(mapStateToProps)(NewItem);