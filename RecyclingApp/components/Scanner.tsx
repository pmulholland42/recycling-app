import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { RNCamera, Barcode, BarCodeType, Point, Size } from 'react-native-camera';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

import { BarcodeInfo } from './BarcodeInfo'
import colors from '../constants/colors';
import { NavigationStackProp } from 'react-navigation-stack';

interface Props {
    navigation: NavigationStackProp<{}>,
    onStopScanning: () => void,
};
interface State {
    isScanning: boolean,
    canScan: boolean,
    modalVisible: boolean,
    barcode: string | null,
};

export class Scanner extends Component<Props, State> {

    camera: RNCamera | null;
    scanCooldown: number;

    constructor(props: Props) {
        super(props);

        this.camera = null;
        this.scanCooldown = 1000;

        this.state = {
            barcode: null,
            isScanning: false,
            canScan: true,
            modalVisible: false,
        }

        this.onBarcodeDetected = this.onBarcodeDetected.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.startScanning = this.startScanning.bind(this);
        this.stopScanning = this.stopScanning.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    onBarcodeDetected(event: {
        data: string;
        rawData?: string;
        type: keyof BarCodeType;
        /**
         * @description For Android use `{ width: number, height: number, origin: Array<Point<string>> }`
         * @description For iOS use `{ origin: Point<string>, size: Size<string> }`
         */
        bounds: { width: number, height: number, origin: Array<Point<string>> } | { origin: Point<string>; size: Size<string> };
      })
    {
        if (this.state.isScanning && this.state.canScan) {
            this.setState({ barcode: event.data, canScan: false, modalVisible: true });
        }
    }

    startScanning() {
        this.setState({ isScanning: true });
    }

    stopScanning() {
        this.closeModal();
        this.setState({ isScanning: false });
    }

    closeModal() {
        this.setState({ modalVisible: false }, () => {
            setTimeout(() => {
                this.setState({ canScan: true });
            }, this.scanCooldown);
        });
    }

    addItem() {
        this.closeModal();
        this.props.navigation.navigate('NewItem');
    }

    render() {
        if (this.state.isScanning) {
            return (
                <View>
                <RNCamera
                    style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'flex-end' }}
                    ref={ref => this.camera = ref}
                    captureAudio={false}
                    onBarCodeRead={this.onBarcodeDetected}
                >

                    <Dialog
                        visible={this.state.modalVisible}
                        onTouchOutside={this.closeModal}
                    >
                        <DialogContent>
                            {!!this.state.barcode && (
                                <BarcodeInfo
                                    barcodeData={this.state.barcode}
                                    closeModal={this.closeModal}
                                    addItem={this.addItem}
                                />
                            )}
                        </DialogContent>
                    </Dialog>

                    { !this.state.modalVisible && <View style={{ width: '75%', padding: 20 }}>
                        <Button
                            title={'Stop scanning'}
                            onPress={this.stopScanning}
                            buttonStyle={{
                                backgroundColor: colors.primaryGreen,
                                height: 50,
                            }}
                            titleStyle={{
                                textAlign: 'center'
                            }}
                        />
                    </View> }

                </RNCamera>
            </View>            );
        } else {
            return (
                <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <View style={{ width: "75%" }}>
                        <Button
                            title={"Press to begin scannning"}
                            onPress={this.startScanning}
                            buttonStyle={{
                                backgroundColor: colors.primaryGreen,
                                height: 100,
                            }}
                            titleStyle={{
                                textAlign: "center"
                            }}
                        />
                    </View>
                </View>
            );
        }
    }
}