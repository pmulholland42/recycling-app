import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import memoize from 'memoize-one';
import { connect } from 'react-redux'

import Material from '../interfaces/Material';
import colors from '../constants/colors';
import styles from '../constants/styles';
import { getRecyclabilityIcon, getMaterialDescription, isRecyclable} from '../utilities/Common';
import { GlobalState } from '../redux/reducers';

interface Props {
    materials: Material[]
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

    /*async getRecyclingTypes(): Promise<Material[]> {
        return [
            {
                type: 'plastic',
                plasticNumber: 1,
                name: 'Polyethylene Terephthalate',
                code: 'PETE',
                isRecyclable: true,
            },
            {
                type: 'plastic',
                plasticNumber: 2,
                name: 'High-Density Polyethylene',
                code: 'HDPE',
                isRecyclable: true,
            },
            {
                type: 'plastic',
                plasticNumber: 3,
                name: 'Polyvinyl Chloride',
                code: 'PVC',
                isRecyclable: false,
            },
            {
                type: 'plastic',
                plasticNumber: 4,
                name: 'Low-Density Polyethylene',
                code: 'LDPE',
                isRecyclable: false,
            },
            {
                type: 'plastic',
                plasticNumber: 5,
                name: 'Polypropylene',
                code: 'PP',
                isRecyclable: false,
            },
            {
                type: 'plastic',
                plasticNumber: 6,
                name: 'Polystyrene',
                code: 'PS',
                isRecyclable: true,
            },
            {
                type: 'plastic',
                plasticNumber: 7,
                name: 'Other',
                isRecyclable: true,
            },
            {
                type: 'glass',
                name: 'Brown glass',
                isRecyclable: true,
            },
            {
                type: 'glass',
                name: 'Green glass',
                isRecyclable: true,
            },
            {
                type: 'glass',
                name: 'Clear glass',
                isRecyclable: true,
            },
            {
                type: 'metal',
                name: 'Steel',
                isRecyclable: true,
            },
            {
                type: 'metal',
                name: 'Tin',
                isRecyclable: true,
            },
            {
                type: 'metal',
                name: 'Aluminum',
                isRecyclable: true,
            },
            {
                type: 'paper',
                name: 'Newspaper',
            },
        ];
    }*/

    sortRecyclingTypes = memoize((types: Material[]) => {
        return types.sort((typeA, typeB) => {
            return this.getTypePriority(typeA) - this.getTypePriority(typeB);
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
            <Text style={styles.headerText}>Your recycling info for Swissvale:</Text>
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
    };
}

export default connect(mapStateToProps)(CheatSheet);