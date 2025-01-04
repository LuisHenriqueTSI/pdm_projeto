import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {Card, FAB, List, useTheme, IconButton} from 'react-native-paper';
import {ReceitaContext} from '../context/ReceitaProvider';
import {Receita} from '../model/Receita';

export default function Receitas({navigation}: any) {
  const theme = useTheme();
  const {receitas, atualizarFavorito} = useContext<any>(ReceitaContext); // Função para atualizar o favorito
  const [favoritosAtualizando, setFavoritosAtualizando] = useState<string[]>(
    [],
  ); // IDs de receitas sendo atualizadas

  const irParaTelaReceita = (receita: Receita | null) => {
    navigation.navigate('ReceitaTela', {
      receita: receita,
    });
  };

  const marcarFavorito = async (receita: Receita) => {
    if (favoritosAtualizando.includes(receita.uid)) return; // Impede múltiplos cliques

    setFavoritosAtualizando(prev => [...prev, receita.uid]); // Marca como "atualizando"

    const receitaAtualizada = {...receita, favorito: !receita.favorito}; // Atualiza localmente
    await atualizarFavorito(receitaAtualizada); // Chama a função do contexto para salvar a mudança

    setFavoritosAtualizando(prev => prev.filter(uid => uid !== receita.uid)); // Remove da lista após atualizar
  };

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <List.Section
        style={{...styles.list, backgroundColor: theme.colors.background}}>
        <ScrollView>
          {receitas.map((receita: Receita, key: number) => (
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
                <Text style={styles.cardDescription}>{receita.descricao}</Text>
              </Card.Content>
              <IconButton
                icon={receita.favorito ? 'heart' : 'heart-outline'}
                iconColor={theme.colors.primary}
                size={30}
                onPress={() => marcarFavorito(receita)} // Chama a função para alternar o favorito
                style={styles.favoritoButton}
                disabled={favoritosAtualizando.includes(receita.uid)} // Desativa durante a atualização
              />
            </Card>
          ))}
        </ScrollView>
      </List.Section>
      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
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
  list: {
    width: '95%',
  },
  card: {
    width: '100%',
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
  favoritoButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    top: 567,
    backgroundColor: 'orange',
    borderRadius: 50,
  },
});
