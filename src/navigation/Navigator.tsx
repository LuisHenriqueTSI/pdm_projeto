/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StatusBar} from 'react-native';
import {Icon, useTheme} from 'react-native-paper';
import AlteraSenha from '../telas/AlteraSenha';
import ListaReceitasFavoritas from '../telas/ListaReceitasFavoritas';
import AdicionarReceita from '../telas/AdicionarReceita';
import Receitas from '../telas/Receita';
import EsqueceuSenha from '../telas/EsqueceuSenha';
import Menu from '../telas/Menu';
import Perfil from '../telas/PerfilTela';
import Preload from '../telas/Preload';
import SignIn from '../telas/SignIn';
import SignUp from '../telas/SignUp';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Preload"
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen component={Preload} name="Preload" />
    <Stack.Screen component={SignIn} name="SignIn" />
    <Stack.Screen component={SignUp} name="SignUp" />
    <Stack.Screen component={EsqueceuSenha} name="EsqueceuSenha" />
  </Stack.Navigator>
);

const AppStack = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Receita"
      screenOptions={() => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {backgroundColor: theme.colors.surface},
      })}>
      <Tab.Screen
        component={Receitas}
        name="Receitas"
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <Icon source="chef-hat" color={theme.colors.primary} size={30} />
          ),
          tabBarIconStyle: {
            alignSelf: 'center',
            marginTop: 7,
          },
        }}
      />

      <Tab.Screen
        component={ListaReceitasFavoritas}
        name="ListaReceitasFavoritas"
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <Icon source="heart" color={theme.colors.primary} size={27} />
          ),
          tabBarIconStyle: {
            alignSelf: 'center',
            marginTop: 7,
          },
        }}
      />

      <Tab.Screen
        component={Menu}
        name="Menu"
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <Icon source="menu" color={theme.colors.primary} size={30} />
          ),
          tabBarIconStyle: {
            alignSelf: 'center',
            marginTop: 7,
          }, // Adicionando margem superior
        }}
      />
    </Tab.Navigator>
  );
};

export default function Navigator() {
  const theme = useTheme();
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={
          theme.dark ? theme.colors.surface : theme.colors.primary
        }
      />
      <Stack.Navigator
        initialRouteName="AuthStack"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={AuthStack} name="AuthStack" />
        <Stack.Screen component={AppStack} name="AppStack" />
        <Stack.Screen
          component={AdicionarReceita}
          name="AdicionarReceita"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen component={Perfil} name="Perfil" />
        <Stack.Screen component={AlteraSenha} name="AlteraSenha" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
