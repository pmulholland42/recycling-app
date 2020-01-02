import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { RNCamera, Barcode, BarCodeType, Point, Size } from 'react-native-camera';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

import { BarcodeInfo } from './BarcodeInfo'
import colors from '../constants/colors';

interface Props {
    onStopScanning: () => void,
};
interface State {
    barcode: string | null,
};

export class Scanner extends Component<Props, State> {

    camera: RNCamera | null;

    constructor(props: Props) {
        super(props);

        this.state = {
            barcode: null,
        }

        this.camera = null;
        this.onBarcodeDetected = this.onBarcodeDetected.bind(this);
        this.closeModal = this.closeModal.bind(this);
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
        if (!this.state.barcode) {
            this.setState({ barcode: event.data });
        }
    }

    closeModal() {
        this.setState({ barcode: null });
    }


    render() {
        return (
            <View>
                <RNCamera
                    style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'flex-end' }}
                    ref={ref => this.camera = ref}
                    captureAudio={false}
                    onBarCodeRead={this.onBarcodeDetected}
                >

                    <Dialog
                        visible={!!this.state.barcode}
                        onTouchOutside={this.closeModal}
                    >
                        <DialogContent>
                            {!!this.state.barcode && (
                                <BarcodeInfo barcodeData={this.state.barcode} onCancel={this.closeModal}></BarcodeInfo>
                            )}
                        </DialogContent>
                    </Dialog>

                    <View style={{ width: '75%', padding: 20 }}>
                        <Button
                            title={'Stop scanning'}
                            onPress={this.props.onStopScanning}
                            buttonStyle={{
                                backgroundColor: colors.primaryGreen,
                                height: 50,
                            }}
                            titleStyle={{
                                textAlign: 'center'
                            }}
                        />
                    </View>

                </RNCamera>
            </View>
        )
    }
}