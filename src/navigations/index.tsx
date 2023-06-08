import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerNavigation } from "./drawer.navigation"

export function Navigation() {
    return(
        <NavigationContainer>
            <DrawerNavigation />
        </NavigationContainer>
    )
}