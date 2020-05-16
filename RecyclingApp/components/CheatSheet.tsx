import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import memoize from 'memoize-one';
import { connect } from 'react-redux'

import Material from '../interfaces/Material';
import styles from '../constants/styles';
import { getRecyclabilityIcon, getMaterialDescription, isRecyclable } from '../utilities/common';
import { GlobalState } from '../redux/reducers';

interface Props {
    materials: Material[],
    locationName: string,
};
interface State {
    loading: boolean,
};

class CheatSheet extends Component<Props, State> {
    static navigationOptions = {
        title: 'Cheat Sheet',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
        }

        this.renderListItem = this.renderListItem.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
    }

    sortRecyclingTypes = memoize((types: Material[]) => {
        return types.sort((typeA, typeB) => {
            let priorityDifference = this.getTypePriority(typeA) - this.getTypePriority(typeB);
            if (priorityDifference == 0) {
                // Sort ties alphabetically
                return getMaterialDescription(typeA).localeCompare(getMaterialDescription(typeB));
            } else {
                return priorityDifference;
            }
        });
    })

    getTypePriority(material: Material) {
        var recyclable = isRecyclable(material);
        if (recyclable === true) {
            return 0;
        } else if (recyclable === false) {
            return 1;
        } else {
            return 2;
        }
    }

    renderHeader() {
        return (
            <Text style={styles.headerText}>Your recycling info for {this.props.locationName}:</Text>
        )
    }

    renderListItem({ item }: { item: Material }) {
        return  (
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, paddingHorizontal: 20 }}>
                {getRecyclabilityIcon(isRecyclable(item), 25, { flex: 1 })}
                <View style={{ flex: 5, flexDirection: 'row' }}>
                    <Text style={styles.defaultText}>{getMaterialDescription(item)}</Text>
                </View>
            </View>
        )
    }

    render() {
        var renderData = this.sortRecyclingTypes(this.props.materials);

        return (
            <View>
                { this.state.loading ?
                    (<Text>Loading...</Text>) :
                    (<FlatList
                        data={renderData}
                        renderItem={this.renderListItem}
                        ListHeaderComponent={this.renderHeader}
                        keyExtractor={item => item.name}
                    />)
                }
            </View>
        )
    }
}

const mapStateToProps = (state: GlobalState) => {
    return {
        materials: state.recyclingReducer.materials,
        locationName: state.locationReducer.locationName,
    };
}

export default connect(mapStateToProps)(CheatSheet);