import React, { useState } from "react";
import { Alert, Image, ImageProps, Text, View } from "react-native"
import { styles } from "./styles";
import { ComponentButtonInterface } from "../../components"
import { IPhoto, DrawerTypes } from "../../navigations/drawer.navigation";
import { useRoute } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library"
import * as ImagePicker from "expo-image-picker"


export function Opcoes({navigation}: DrawerTypes) {
    const route = useRoute()
    const [permMedia, requestPermMedia] = MediaLibrary.usePermissions()
    const picture = route.params as IPhoto
    const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset>()
    
    if(!permMedia){
        <View />
    }

    if(!permMedia?.granted){
        return(
            <ComponentButtonInterface onPress={requestPermMedia}>
                <Text style={styles.buttonText}> Permita salvar as imagens</Text>
            </ComponentButtonInterface>
        )
    }

    async function abrirImagem() {
        const result =  await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4,3],
            quality: 1
        })
        if(!result.canceled){
            setPhoto(result.assets[0])
        }
    }

    async function salvarImagem() {
        const asset = await MediaLibrary.createAssetAsync(picture!.uri)
        MediaLibrary.createAlbumAsync("Images", asset, false)
        Alert.alert("Imagem salva com sucesso!")
    }

    return(
        <View style={styles.container}>
            <ComponentButtonInterface onPress={() => navigation.navigate("Camera")} /* Vai para a página da Câmera */>
                <Text style={styles.buttonText}>Tirar foto</Text>
            </ComponentButtonInterface>
            {photo && (
                <Image source={{ uri: photo.uri}} style={styles.image} />
            )}
            { picture && (
                <>
                <Image source={{ uri: picture.uri}} style={styles.image} /* Salva a foto *//>
                <ComponentButtonInterface onPress={salvarImagem}>
                    <Text style={styles.buttonText}>Salvar Imagem</Text>
                </ComponentButtonInterface>
                </>
            )}
            <ComponentButtonInterface onPress={abrirImagem} /* Abre a galeria */>
                <Text style={styles.buttonText}>Abrir Imagem</Text>
            </ComponentButtonInterface>
        </View>
    )
}