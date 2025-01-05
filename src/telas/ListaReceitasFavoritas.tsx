import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {Card, List, useTheme} from 'react-native-paper';
import {ReceitaContext} from '../context/ReceitaProvider';
import {Receita} from '../model/Receita';

export default function Favoritos({navigation}: {navigation: any}) {
  const theme = useTheme();
  const {receitas} = useContext(ReceitaContext) ?? {};

  // Filtra as receitas favoritas (verifica se receitas está definido)
  const receitasFavoritas =
    receitas?.filter((receita: Receita) => receita.favorito) || [];

  const irParaTelaReceita = (receita: Receita) => {
    navigation.navigate('AdicionarReceita', {
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
            receitasFavoritas.map((receita: Receita, index: number) => (
              <Card
                key={index}
                style={{...styles.card, borderColor: theme.colors.secondary}}
                onPress={() => irParaTelaReceita(receita)}>
                <Card.Cover
                  source={{uri: receita.urlFoto || undefined}}
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
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4, // Adiciona sombra no Android
    backgroundColor: 'white',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  cardDescription: {
    fontSize: 14,
    color: 'gray',
  },
  noFavoritesText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});
