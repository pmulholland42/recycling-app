import React, { Component } from 'react';
import { View, Text, Image, Dimensions, LayoutChangeEvent } from 'react-native';
import { Button } from 'react-native-elements';
import { RNCamera, Barcode, BarCodeType, Point, Size } from 'react-native-camera';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

import { BarcodeInfo } from './BarcodeInfo'
import colors from '../constants/colors';
import { NavigationStackProp } from 'react-navigation-stack';

const scannerBoxImage = require('../images/scanner-box.png');

interface Props {
    navigation: NavigationStackProp<{}>,
    onStopScanning: () => void,
};
interface State {
    isCameraOpen: boolean,
    canScan: boolean,
    modalVisible: boolean,
    barcode: string | null,
    screenWidth: number,
};

export class Scanner extends Component<Props, State> {

    /** The time, in ms, between closing the modal and when scanning becomes enabled again */
    scanCooldown: number;
    /** The setTimeout timer id for the scan cooldown */
    scanCooldownTimer: number;

    constructor(props: Props) {
        super(props);

        this.scanCooldown = 1000;
        this.scanCooldownTimer = -1;

        this.state = {
            barcode: null,
            isCameraOpen: false,
            canScan: true,
            modalVisible: false,
            screenWidth: Dimensions.get('screen').width,
        }

        this.onBarcodeDetected = this.onBarcodeDetected.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.startScanning = this.startScanning.bind(this);
        this.stopScanning = this.stopScanning.bind(this);
        this.addItem = this.addItem.bind(this);
        this.updateLayout = this.updateLayout.bind(this);
    }

    componentDidMount() {
        // After we navigate back to the scanner from the add item screen, scanning should be enabled
        this.props.navigation.addListener('didFocus', () => {
            this.setState({ canScan: true });
        })
    }

    componentWillUnmount() {
        clearTimeout(this.scanCooldownTimer);
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
        if (this.state.isCameraOpen && this.state.canScan) {
            console.log(event.data);
            this.setState({ barcode: event.data, canScan: false, modalVisible: true });
        }
    }

    startScanning() {
        this.setState({ isCameraOpen: true });
    }

    stopScanning() {
        this.setState({ isCameraOpen: false });
    }

    closeModal() {
        this.setState({ modalVisible: false }, () => {
            this.scanCooldownTimer = setTimeout(() => {
                this.setState({ canScan: true });
            }, this.scanCooldown);
        });
    }

    addItem() {
        // Close the modal, then go the the new item screen
        this.setState({ modalVisible: false }, () => {
            this.props.navigation.navigate('NewItem');
        });
    }

    updateLayout(event: LayoutChangeEvent) {
        this.setState({ screenWidth: Dimensions.get('screen').width });
    }

    render() {
        let buttonWidth = this.state.screenWidth / 2;

        if (this.state.isCameraOpen) {
            return (
            <View onLayout={this.updateLayout}>
                <RNCamera
                    style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
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


                    { !this.state.modalVisible && <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={scannerBoxImage} />
                    </View> }

                    { !this.state.modalVisible && <View style={{ position: 'absolute', width: buttonWidth, bottom: 20 }}>
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
            </View> );
        } else {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <View style={{ width: '75%' }}>
                        <Button
                            title={'Press to begin scanning'}
                            onPress={this.startScanning}
                            buttonStyle={{
                                backgroundColor: colors.primaryGreen,
                                height: 100,
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