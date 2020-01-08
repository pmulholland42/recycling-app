import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-elements'
import ModalSelector from 'react-native-modal-selector';
import { connect } from 'react-redux';

import Item from '../interfaces/Item';
import styles from '../constants/styles';
import Material from '../interfaces/Material';
import { GlobalState } from 'redux/reducers';

interface Props {
    barcode: string,
    materials: Material[],
};
interface State {
    name: string,
    materialName: string,
};

class NewItem extends Component<Props, State> {

    defaultTypeOption = 'Select material type';

    constructor(props: Props) {
        super(props);

        this.state = {
            name: '',
            materialName: '',
        }
    }

    render() {

        let index = 0;
        const modalData = this.props.materials.map(type => {
            return {
                key: index++,
                label: type.name,
            }
        });

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

                <Text style={styles.defaultText}>Material:</Text>
                <ModalSelector
                    style={{ paddingTop: 20 }}
                    data={modalData}
                    initValue={this.defaultTypeOption}
                    onChange={option => this.setState({ materialName: option.label })}
                >
                </ModalSelector>


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