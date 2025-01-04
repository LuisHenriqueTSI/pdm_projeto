/* eslint-disable react/no-unstable-nested-components */
import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {Card, FAB, List, useTheme} from 'react-native-paper';
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
              {/* Imagem ocupa toda a largura */}
              <Card.Cover
                source={{uri: receita.urlFoto}}
                style={styles.cardImage}
              />
              {/* Nome da receita */}
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardTitle}>{receita.nome}</Text>
                <Text style={styles.cardDescription}>{receita.descricao}</Text>
              </Card.Content>
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
    width: '100%',
    marginBottom: 10,
    padding: 20,
  },
  cardImage: {
    width: '100%',
    height: 300,
  },
  cardContent: {
    padding: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  cardDescription: {
    fontSize: 16,
    color: 'grey',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    top: 567,
  },
});
