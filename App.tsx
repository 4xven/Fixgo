import React from "react";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./components/splashscreen";
import CustomerLogin from "./app/customer/auth/login";
import ProviderLogin from "./app/provider/auth/login";
import CustomerRegistration from "./app/customer/auth/registration";
import ProviderRegistration from "./app/provider/auth/registration";
import Home from "./app/customer/navbar/home";
import HomeProvider from "./app/provider/home_pro";
import CustomerTabs from "./app/customer/customerTabs";
import BookingScreen from "./app/customer/navbar/booking/bookingScreen";
import BookingExpertScreen from "./app/customer/navbar/booking/bookingExpertScreen";
import HelpSupport from "./app/customer/navbar/support/help";
import PrivacyPolicy from "./app/customer/navbar/support/privacy";
import TermsOfService from "./app/customer/navbar/support/terms";
import AboutFixGo from "./app/customer/navbar/support/about";
import PersonalInformation from "./app/customer/navbar/support/information";




export type RootStackParamList = {
  SplashScreen: { 
    nextScreen?: keyof RootStackParamList;
    serviceType?: string;
    expert?: any;
   };
  CustomerLogin: undefined;
  ProviderLogin: undefined;
  CustomerRegistration: undefined;
  ProviderRegistration: undefined;
  Home: undefined;
  HomeProvider: undefined;
  CustomerTabs: { screen?: "Home" | "Book" | "AIChat" | "Profile" };
   BookingScreen: { serviceType?: string };
     BookingExpertScreen: { expert: any };

    HelpSupport: undefined;
    PrivacyPolicy: undefined;
    AboutFixGo: undefined;
    TermsOfService: undefined;
    PersonalInformation: undefined;
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
        <Stack.Screen
          name="CustomerRegistration"
          component={CustomerRegistration}
        />
        <Stack.Screen
          name="ProviderRegistration"
          component={ProviderRegistration}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="HomeProvider" component={HomeProvider} />
        <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} />
        <Stack.Screen name="BookingExpertScreen" component={BookingExpertScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermsOfService" component={TermsOfService} />
        <Stack.Screen name="AboutFixGo" component={AboutFixGo} />
        <Stack.Screen name="PersonalInformation" component={PersonalInformation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
export default App;
