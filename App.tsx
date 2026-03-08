import React from "react";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./components/splashscreen";
import CustomerLogin from "./app/customer/auth/login";
import ProviderLogin from "./app/provider/auth/login";
import CustomerRegistration from "./app/customer/auth/registration";
import ProviderRegistration from "./app/provider/auth/registration";
import Home from "./app/customer/home";
import HomeProvider from "./app/provider/home_pro";

export type RootStackParamList = {
  SplashScreen: { nextScreen?: keyof RootStackParamList };
  CustomerLogin: undefined;
  ProviderLogin: undefined;
  CustomerRegistration: undefined;
  ProviderRegistration: undefined;
  Home: undefined;
  HomeProvider: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CustomerLogin"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="CustomerLogin" component={CustomerLogin} />
        <Stack.Screen name="ProviderLogin" component={ProviderLogin} />
        <Stack.Screen name="CustomerRegistration" component={CustomerRegistration} />
        <Stack.Screen name="ProviderRegistration" component={ProviderRegistration} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="HomeProvider" component={HomeProvider} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
export default App;