import React from 'react';
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import {AuthProvider} from '../context/AuthProvider';
import {ReceitaProvider} from '../context/ReceitaProvider';
import {UserProvider} from '../context/UserProvider';
import Navigator from './Navigator';

// Ampliando o tema com paleta voltada para comida
const themeLight = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FCA311', // Amarelo dourado
    accent: '#FF8C42', // Laranja queimado
    background: '#FFF3E2', // Creme claro
    surface: '#fffedc', // superfice clara
    text: '#4E4E4E', // Cinza escuro
    error: '#D32F2F', // Vermelho intenso
    onPrimary: '#FFFFFF', // Branco
    onSurface: '#1C1C1C', // Preto suave
    onBackground: '#1C1C1C', // Preto suave para fundo claro
    disabled: '#A5A5A5', // Cinza suave
    placeholder: '#D8D8D8', // Cinza claro
    backdrop: 'rgba(0, 0, 0, 0.3)', // Transparente escuro
    notification: '#F50057', // Cor de notificação
  },
};

const themeDark = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF6F00', // Laranja vibrante
    accent: '#FF8C42', // Laranja queimado
    background: '#121212', // Escuro
    surface: '#333333', // Superfície escura
    text: '#FFFFFF', // Branco para contraste
    error: '#CF6679', // Vermelho claro
    onPrimary: '#FFFFFF', // Branco
    onSurface: '#1C1C1C', // Preto suave
    onBackground: '#FFFFFF', // Branco sobre fundo escuro
    disabled: '#555555', // Cinza para elementos desabilitados
    placeholder: '#AAAAAA', // Cinza para placeholders
    backdrop: 'rgba(255, 255, 255, 0.5)', // Transparente claro
    notification: '#F50057', // Cor de notificação
  },
};

const temaDoApp = true; // TODO: passar para Context para mudar o tema do app

export default function Providers() {
  return (
    <AuthProvider>
      <UserProvider>
        <ReceitaProvider>
          <PaperProvider theme={temaDoApp ? themeLight : themeDark}>
            <Navigator />
          </PaperProvider>
        </ReceitaProvider>
      </UserProvider>
    </AuthProvider>
  );
}
