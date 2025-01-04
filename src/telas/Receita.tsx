/* eslint-disable react/no-unstable-nested-components */
import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Card, FAB, List, useTheme} from 'react-native-paper';
import {ReceitaContext} from '../context/ReceitaProvider';
import {Receita} from '../model/Receita';

export default function Receitas({navigation}: any) {
  const theme = useTheme();
  const {receitas} = useContext<any>(ReceitaContext);

  const irParaTelaReceita = (receita: Receita | null) => {
    navigation.navigate('ReceitaTela', {
      receita: receita,
    });
  };

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <List.Section
        style={{...styles.list, backgroundColor: theme.colors.background}}>
        <List.Subheader style={styles.subhearder}>
          Lista de Receitas
        </List.Subheader>
        <ScrollView>
          {receitas.map((receita: Receita, key: number) => (
            <Card
              key={key}
              style={{...styles.card, borderColor: theme.colors.secondary}}
              onPress={() => irParaTelaReceita(receita)}>
              <Card.Title
                title={receita.nome}
                subtitle={receita.descricao}
                left={() => (
                  <Avatar.Image size={40} source={{uri: receita.urlFoto}} />
                )}
              />
            </Card>
          ))}
        </ScrollView>
      </List.Section>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => irParaTelaReceita(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subhearder: {
    fontSize: 20,
    alignSelf: 'center',
  },
  list: {
    width: '95%',
  },
  card: {
    height: 100,
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
