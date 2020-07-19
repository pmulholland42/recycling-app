import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import memoize from 'memoize-one';
import { connect } from 'react-redux'

import Material from '../interfaces/Material';
import styles from '../constants/styles';
import { getRecyclabilityIcon, getMaterialDescription, isRecyclable } from '../utilities/common';
import { GlobalState } from '../redux/reducers';
import { Location } from '../interfaces/Location';

interface Props {
    materials: Material[],
    /** The name of municipality / city that the user is in */
    location: Location,
};
interface State {
    loading: boolean,
};

/**
 * A list of materials and an icon indicating whether each of them is recyclable.
 * For quick reference without scanning.
 */
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

    /**
     * Get the sorting priority of a material, based on its recyclability status
     * @param material
     */
    getTypePriority(material: Material) {
        let recyclable = isRecyclable(material);
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
            <Text style={styles.headerText}>Your recycling info for {this.props.location.name}:</Text>
        )
    }

    renderListItem({ item }: { item: Material }) {
        return  (
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, paddingHorizontal: 20 }}>
                {/* Checkmark, X, or question mark icon */}
                {getRecyclabilityIcon(isRecyclable(item), 25, { flex: 1 })}
                {/* Material name and description */}
                <View style={{ flex: 5, flexDirection: 'row' }}>
                    <Text style={styles.defaultText}>{getMaterialDescription(item)}</Text>
                </View>
            </View>
        )
    }

    render() {
        const renderData = this.sortRecyclingTypes(this.props.materials);

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
        location: state.locationReducer.location,
    };
}

export default connect(mapStateToProps)(CheatSheet);