import ImageResizer from '@bam.tech/react-native-image-resizer';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, {createContext, useEffect, useState} from 'react';
import {Receita as Receita} from '../model/Receita';

export const ReceitaContext = createContext({});

export const ReceitaProvider = ({children}: any) => {
  const [receitas, setReceitas] = useState<Receita[]>([]);

  useEffect(() => {
    const listener = firestore()
      .collection('receitas')
      .orderBy('nome')
      .onSnapshot(snapShot => {
        if (snapShot) {
          let data: Receita[] = [];
          snapShot.forEach(doc => {
            data.push({
              uid: doc.id,
              nome: doc.data().nome,
              descricao: doc.data().descricao,
              ingredientes: doc.data().ingredientes,
              favorito: doc.data().favorito,
              urlFoto: doc.data().urlFoto,
            });
          });
          setReceitas(data);
        }
      });

    return () => {
      listener();
    };
  }, []);

  const salvar = async (
    receita: Receita,
    urlDevice: string,
  ): Promise<string> => {
    try {
      if (receita.uid === '') {
        receita.uid = firestore().collection('receitas').doc().id;
      }
      if (urlDevice !== '') {
        receita.urlFoto = await sendImageToStorage(receita, urlDevice);
        if (!receita.urlFoto) {
          return 'Não foi possível salvar a imagem. Contate o suporte técnico.';
        }
      }
      await firestore().collection('receitas').doc(receita.uid).set(
        {
          nome: receita.nome,
          descricao: receita.descricao,
          ingredientes: receita.ingredientes,
          favorito: receita.favorito,
          urlFoto: receita.urlFoto,
        },
        {merge: true},
      );
      return 'ok';
    } catch (e) {
      console.error('ReceitaProvider, salvar: ' + e);
      return 'Não foi possível salvar a receita. Por favor, contate o suporte técnico.';
    }
  };

  const excluir = async (receita: Receita) => {
    try {
      await firestore().collection('receitas').doc(receita.uid).delete();
      const pathToStorage = `imagens/receitas/${receita?.uid}/foto.png`;
      await storage().ref(pathToStorage).delete();
      return 'ok';
    } catch (e) {
      console.error('ReceitaProvider, excluir: ', e);
      return 'Não foi possível excluir a receita. Por favor, contate o suporte técnico.';
    }
  };

  // Função para atualizar o status de favorito da receita
  const atualizarFavorito = async (receita: Receita) => {
    try {
      // Atualiza o campo "favorito" no Firestore
      await firestore().collection('receitas').doc(receita.uid).update({
        favorito: !receita.favorito, // Inverte o valor de "favorito"
      });

      // Atualiza o estado local de receitas
      setReceitas(prevReceitas =>
        prevReceitas.map(r =>
          r.uid === receita.uid ? {...r, favorito: !r.favorito} : r,
        ),
      );
    } catch (e) {
      console.error('ReceitaProvider, atualizarFavorito: ' + e);
    }
  };

  //urlDevice: qual imagem deve ser enviada via upload
  async function sendImageToStorage(
    receita: Receita,
    urlDevice: string,
  ): Promise<string> {
    //1. Redimensiona e compacta a imagem
    let imageRedimencionada = await ImageResizer.createResizedImage(
      urlDevice,
      150,
      200,
      'PNG',
      80,
    );
    //2. e prepara o path onde ela deve ser salva no storage
    const pathToStorage = `imagens/receitas/${receita?.uid}/foto.png`;

    //3. Envia para o storage
    let url: string | null = ''; //local onde a imagem será salva no Storage
    const task = storage().ref(pathToStorage).putFile(imageRedimencionada?.uri);
    task.on('state_changed', taskSnapshot => {
      //Para acompanhar o upload, se necessário
    });

    //4. Busca a URL gerada pelo Storage
    await task.then(async () => {
      //se a task finalizar com sucesso, busca a url
      url = await storage().ref(pathToStorage).getDownloadURL();
    });
    //5. Pode dar zebra, então pega a exceção
    task.catch(e => {
      console.error('ReceitaProvider, sendImageToStorage: ' + e);
      url = null;
    });
    return url;
  }

  return (
    <ReceitaContext.Provider
      value={{receitas, salvar, excluir, atualizarFavorito}}>
      {children}
    </ReceitaContext.Provider>
  );
};
