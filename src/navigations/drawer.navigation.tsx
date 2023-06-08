import React from "react";
import {DrawerNavigationProp, createDrawerNavigator} from "@react-navigation/drawer"
import { ScreenCamera, ScreenOpcoes } from "../screens"
import { colors } from "../styles/colors";
import { FontAwesome } from '@expo/vector-icons'

export interface IPhoto{
    uri: string
}


type DrawerParamList = {
    Opcoes: undefined | IPhoto
    Camera: undefined
}
type DrawerScreenNav = DrawerNavigationProp<DrawerParamList, 'Opcoes' >
export type DrawerTypes = {
    navigation: DrawerScreenNav
}

export function DrawerNavigation(){
    const Drawer = createDrawerNavigator<DrawerParamList>()
    return (
        <Drawer.Navigator 
            screenOptions={{
                drawerActiveBackgroundColor: colors.primaryLight,
                drawerActiveTintColor: colors.white,
                headerStyle: {
                    backgroundColor: colors.primaryLight
                },
                headerTintColor: colors.white,
                drawerInactiveBackgroundColor: colors.primary,
                drawerInactiveTintColor: colors.white,
                drawerStyle: {
                    backgroundColor: colors.primaryLight,

                }
            }}
        >
            <Drawer.Screen name="Opcoes" component={ScreenOpcoes} 
                options={{
                    drawerIcon:() => (
                        <FontAwesome name="file-text" size={24} color={colors.white} />
                    ),
                }}
            />
            <Drawer.Screen name="Camera" component={ScreenCamera}
                options={{
                    drawerIcon:() => (
                        <FontAwesome name="camera" size={24} color={colors.white} />
                    ),
                }}
            />
        </Drawer.Navigator>
    )
}