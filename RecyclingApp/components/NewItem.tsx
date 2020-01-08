import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-elements'
import ModalSelector from 'react-native-modal-selector';
import { connect } from 'react-redux';

import Item from '../interfaces/Item';
import styles from '../constants/styles';
import RecyclingType from '../interfaces/RecyclingType';
import { GlobalState } from 'redux/reducers';

interface Props {
    barcode: string,
    recyclingTypes: RecyclingType[],
};
interface State {
    name: string,
    typeName: string,
};

class NewItem extends Component<Props, State> {

    defaultTypeOption = 'Select material type';

    constructor(props: Props) {
        super(props);

        this.state = {
            name: '',
            typeName: '',
        }
    }

    render() {

        let index = 0;
        const modalData = this.props.recyclingTypes.map(type => {
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

                <Text style={styles.defaultText}>Material type:</Text>
                <ModalSelector
                    style={{ paddingTop: 20 }}
                    data={modalData}
                    initValue={this.defaultTypeOption}
                    onChange={option => this.setState({ typeName: option.label })}
                >
                </ModalSelector>


            </View>
        )
    }
}

const mapStateToProps = (state: GlobalState) => {
    return {
        recyclingTypes: state.recyclingTypesReducer.recyclingTypes,
    };
}
export default connect(mapStateToProps)(NewItem);