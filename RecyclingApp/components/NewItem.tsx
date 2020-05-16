import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-elements'
import ModalSelector, { IOption } from 'react-native-modal-selector';
import { connect } from 'react-redux';

import Item from '../interfaces/Item';
import styles from '../constants/styles';
import Material from '../interfaces/Material';
import { GlobalState } from 'redux/reducers';
import { getMaterialDescription } from '../utilities/common';
import colors from '../constants/colors';
import { NavigationStackProp } from 'react-navigation-stack';

interface Props {
    navigation: NavigationStackProp<{}>,
    barcode: string,
    materials: Material[],
};
interface State {
    itemName: string,
    materialName: string,
};

class NewItem extends Component<Props, State> {

    defaultMaterialOption = 'Select material type';

    constructor(props: Props) {
        super(props);

        this.state = {
            itemName: '',
            materialName: '',
        }

        this.onDonePress = this.onDonePress.bind(this);
        this.onCancelPress = this.onCancelPress.bind(this);
    }

    onDonePress() {
        // TODO: add new item to db
        this.props.navigation.navigate('Scanner');
    }

    onCancelPress() {
        this.props.navigation.navigate('Scanner');
    }

    render() {
        var materialTypes: string[] = [];
        this.props.materials.forEach(material => {
            if (!materialTypes.includes(material.type)) {
                materialTypes.push(material.type);
            }
        })

        let index = 0;
        var modalSections: IOption[] = materialTypes.map(materialType => {
            return {
                key: index++,
                section: true,
                label: materialType,
            }
        });

        var modalData: IOption[] = [];

        modalSections.forEach(modalSection => {
            modalData.push(modalSection);
            modalData = modalData.concat(this.props.materials.filter(material => {
                return material.type === modalSection.label;
            }).map(material => {
                return {
                    key: index++,
                    label: getMaterialDescription(material),
                }
            }));
        })



        return (
            <View style={{ padding: 20, justifyContent: 'space-between' }}>

                <View>
                    <Text style={styles.headerText}>Add a new item</Text>
                    <Text style={styles.defaultText}>Name of item:</Text>
                    <TextInput
                        style={styles.textBox}
                        placeholder={'ie. Dasani water bottle'}
                        value={this.state.itemName}
                        onChangeText={itemName => { this.setState({ itemName }) }}
                    />

                    <Text style={styles.defaultText}>Material:</Text>
                    <ModalSelector
                        style={{ paddingTop: 20 }}
                        data={modalData}
                        initValue={this.defaultMaterialOption}
                        onChange={option => this.setState({ materialName: option.label ?? '' })}
                    >
                    </ModalSelector>
                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 30 }}>
                    <Button
                        title={'Cancel'}
                        style={{ flex: 1 }}
                        buttonStyle={{ backgroundColor: 'grey' }}
                        onPress={this.onCancelPress}
                    />
                    <Button
                        title={'Done'}
                        disabled={ !this.state.itemName || !this.state.materialName }
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