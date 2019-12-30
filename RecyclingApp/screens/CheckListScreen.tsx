import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import memoize from 'memoize-one'

import RecyclingType from '../interfaces/RecyclingType';
import colors from '../constants/colors';
import styles from '../constants/styles';

interface Props {};
interface State {
    loading: boolean,
    types: RecyclingType[],
};

export class CheckListScreen extends Component<Props, State> {
    static navigationOptions = {
        title: 'Check List',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
            types: [],
        }

        this.renderListItem = this.renderListItem.bind(this);
        this.renderHeader = this.renderHeader.bind(this);

        this.getRecyclingTypes().then(types => {
            this.setState({ loading: false, types });
        });
    }

    async getRecyclingTypes(): Promise<RecyclingType[]> {
        return [
            {
                materialType: 'plastic',
                plasticNumber: 1,
                name: 'Polyethylene Terephthalate',
                code: 'PETE',
                isRecyclable: true,
            },
            {
                materialType: 'plastic',
                plasticNumber: 2,
                name: 'High-Density Polyethylene',
                code: 'HDPE',
                isRecyclable: true,
            },
            {
                materialType: 'plastic',
                plasticNumber: 3,
                name: 'Polyvinyl Chloride',
                code: 'PVC',
                isRecyclable: false,
            },
            {
                materialType: 'plastic',
                plasticNumber: 4,
                name: 'Low-Density Polyethylene',
                code: 'LDPE',
                isRecyclable: false,
            },
            {
                materialType: 'plastic',
                plasticNumber: 5,
                name: 'Polypropylene',
                code: 'PP',
                isRecyclable: false,
            },
            {
                materialType: 'plastic',
                plasticNumber: 6,
                name: 'Polystyrene',
                code: 'PS',
                isRecyclable: true,
            },
            {
                materialType: 'plastic',
                plasticNumber: 7,
                name: 'Other',
                isRecyclable: true,
            },
            {
                materialType: 'glass',
                name: 'Brown glass',
                isRecyclable: true,
            },
            {
                materialType: 'glass',
                name: 'Green glass',
                isRecyclable: true,
            },
            {
                materialType: 'glass',
                name: 'Clear glass',
                isRecyclable: true,
            },
            {
                materialType: 'metal',
                name: 'Steel',
                isRecyclable: true,
            },
            {
                materialType: 'metal',
                name: 'Tin',
                isRecyclable: true,
            },
            {
                materialType: 'metal',
                name: 'Aluminum',
                isRecyclable: true,
            },
            {
                materialType: 'paper',
                name: 'Newspaper',
            },
        ];
    }

    sortRecyclingTypes = memoize((types: RecyclingType[]) => {
        return types.sort((typeA, typeB) => {
            return this.getTypePriority(typeA) - this.getTypePriority(typeB);
        });
    })

    getTypePriority(type: RecyclingType) {
        if (type.isRecyclable === true) {
            return 0;
        } else if (type.isRecyclable === false) {
            return 1;
        } else {
            return 2;
        }
    }

    renderHeader() {
        return (
            <Text style={styles.checkListHeader}>Your recycling info for Swissvale:</Text>
        )
    }

    renderListItem({ item }: { item: RecyclingType }) {
        let iconName: string;
        let iconColor: string;
        if (item.isRecyclable === true) {
            iconName = 'check';
            iconColor = colors.secondaryGreen;
        } else if (item.isRecyclable === false) {
            iconName = 'ban';
            iconColor = colors.orange;

        } else {
            iconName = 'question';
            iconColor = 'black';
        }

        let itemDescription: string;
        if (item.plasticNumber) {
            itemDescription = `Plastic #${item.plasticNumber} - ${item.name}`;
        } else {
            itemDescription = item.name;
        }
        if (item.code) {
            itemDescription += ` (${item.code})`;
        }

        return  (
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, paddingHorizontal: 20 }}>
                <Icon name={iconName} size={25} color={iconColor} style={{ flex: 1 }} />
                <View style={{ flex: 5, flexDirection: 'row' }}>
                    <Text style={styles.checkListText}>{itemDescription}</Text>
                </View>
            </View>
        )
    }

    render() {
        var renderData = this.sortRecyclingTypes(this.state.types);

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