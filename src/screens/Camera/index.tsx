import React, { useRef, useState } from "react";
import { View, Text, Alert, Button } from "react-native"
import { ComponentButtonInterface } from "../../components"
import { styles } from "./styles"
import { Camera, CameraCapturedPicture, CameraType, FaceDetectionResult } from 'expo-camera'
// Se não for detecção de rosto pode apagar o import abaixo
import * as FaceDetector from "expo-face-detector"
// Se não for de QrCode pode apagar o import abaixo
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner"
import { DrawerTypes } from "../../navigations/drawer.navigation";

export function CameraScreen({ navigation }: DrawerTypes) {
    const[type, setType] = useState(CameraType.back)
    const[permCamera, requestPermCamera] = Camera.useCameraPermissions()
    // Se não for de QrCode pode apagar a linha abaixo
    const[permQrCode, requestPermQrCode] = BarCodeScanner.usePermissions()
    // Se não for de QrCode pode apagar a linha abaixo
    const[scanned, setScanned] = useState(false)
    // Se não for detecção de rosto pode apagar a linha abaixo
    const[face, setFace] = useState<FaceDetector.FaceFeature>()
    const ref = useRef<Camera>(null)

    if(!permCamera || !permQrCode) {
        // Se não for de QrCode a linha acima deve ficar: if(!permCamera) {
        return <View />
    }
    if(!permCamera.granted) {
        return (
            <ComponentButtonInterface onPress={requestPermCamera}>
                <Text>Permita o acesso à sua câmera</Text>
            </ComponentButtonInterface>
        )
    }
    if(!permQrCode.granted) {
        // Se não for de QrCode pode apagar esse if
        return (
            <ComponentButtonInterface onPress={requestPermQrCode}>
                <Text>Permita a leitura do QrCode</Text>
            </ComponentButtonInterface>
        )
    }
    function viraCamera() {
        setType(cur => (cur === CameraType.back ? CameraType.front : CameraType.back))
    }
    async function tiraPhoto(){
        if(ref.current) {
            const picture = await ref.current.takePictureAsync()
            navigation.navigate("Opcoes", {uri: picture.uri})
        }
    }
    function detectaRosto({faces}: FaceDetectionResult) {
        // Se não for detecção de rosto pode apagar essa função
        if(faces.length > 0 ) {
            const faceDetect = faces[0] as FaceDetector.FaceFeature
            setFace(faceDetect)
        } else {
            setFace(undefined)
        }
    }
    function scaneiaQrCode({data}: BarCodeScannerResult) {
        // Se não for de QrCode pode apagar essa função
        setScanned(true)
        Alert.alert(data)
    }

    return(
        <View style={styles.container}>
            <ComponentButtonInterface onPress={viraCamera}>
                <Text style={styles.buttonText}>Virar Câmera</Text>
            </ComponentButtonInterface>

            <Camera style={styles.camera} type={type} ref={ref} 
                // Se não for detecção de rosto pode apagar desde o "onFacesDetected" até o "tracking"
                onFacesDetected={detectaRosto}
                faceDetectorSettings={{ 
                    mode: FaceDetector.FaceDetectorMode.accurate,
                    detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                    runClassifications: FaceDetector.FaceDetectorClassifications.all,
                    minDetectionInterval: 1000,
                    tracking: true,
                }}
                // Se não for de QrCode pode apagar a linha abaixo
                onBarCodeScanned={scanned ? undefined: scaneiaQrCode}
            />

            <ComponentButtonInterface onPress={tiraPhoto}>
                <Text style={styles.buttonText}>Tirar Foto</Text>
            </ComponentButtonInterface>
            { /* Para ler o QRCode novamente (Se não for de QrCode pode apagar) */ scanned && (
                <ComponentButtonInterface onPress={() => setScanned(false)}>
                    <Text style={styles.buttonText}>Ler QrCode novamente</Text>
                </ComponentButtonInterface>
            )}

            <View style={styles.sorriso}>
                {/* Para mudar o que vai ser detectado (Se não for detecção de rosto pode apagar) */ face && face.smilingProbability && face.smilingProbability > 0.5 ? (
                    // Para alterar o que mostra na tela
                    <Text>Sorrindo</Text>
                ) : (
                    <Text>Séria</Text>
                )}
            </View>
        </View>
    )
}