/* eslint-disable react/no-unstable-nested-components */
import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native'; // Importando o Text de react-native
import {Card, List, useTheme} from 'react-native-paper';
import {ReceitaContext} from '../context/ReceitaProvider'; // Use o contexto de receitas
import {Receita} from '../model/Receita';

export default function Favoritos({navigation}: any) {
  const theme = useTheme();
  const {receitas} = useContext(ReceitaContext);

  // Filtra as receitas favoritas
  const receitasFavoritas = receitas.filter(
    (receita: Receita) => receita.favorito,
  );

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
        <List.Subheader style={styles.subheader}>
          Receitas Favoritas
        </List.Subheader>
        <ScrollView>
          {receitasFavoritas.length === 0 ? (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.noFavoritesText}>
                  Você ainda não tem receitas favoritas.
                </Text>
              </Card.Content>
            </Card>
          ) : (
            receitasFavoritas.map((receita: Receita, key: number) => (
              <Card
                key={key}
                style={{...styles.card, borderColor: theme.colors.secondary}}
                onPress={() => irParaTelaReceita(receita)}>
                <Card.Cover
                  source={{uri: receita.urlFoto}}
                  style={styles.cardImage}
                />
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{receita.nome}</Text>
                  <Text style={styles.cardDescription}>
                    {receita.descricao}
                  </Text>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  subheader: {
    fontSize: 20,
    alignSelf: 'center',
  },
  list: {
    width: '95%',
  },
  card: {
    marginBottom: 10,
    padding: 20,
    borderRadius: 1,
  },
  cardImage: {
    width: '100%',
    height: 300,
    borderRadius: 1,
  },
  cardContent: {
    padding: 20,
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
  noFavoritesText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
});
