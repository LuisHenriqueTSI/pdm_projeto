import ImageResizer from '@bam.tech/react-native-image-resizer';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, {createContext, useEffect, useState} from 'react';
import {Receita} from '../model/Receita';

type ReceitaContextType = {
  receitas: Receita[];
  salvar: (receita: Receita, urlDevice: string) => Promise<string>;
  excluir: (receita: Receita) => Promise<string>;
  atualizarFavorito: (receita: Receita) => Promise<void>;
};

export const ReceitaContext = createContext<ReceitaContextType | undefined>(
  undefined,
);

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
              dificuldade: doc.data().dificuldade,
              tempoPreparo: doc.data().tempoPreparo,
              categoria: doc.data().categoria,
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
          dificuldade: receita.dificuldade,
          tempoPreparo: receita.tempoPreparo,
          categoria: receita.categoria,
        },
        {merge: true},
      );
      return 'ok';
    } catch (e: any) {
      console.error('ReceitaProvider, salvar: ' + e);
      return 'Não foi possível salvar a receita. Por favor, contate o suporte técnico.';
    }
  };

  const excluir = async (receita: Receita) => {
    try {
      await firestore().collection('receitas').doc(receita.uid).delete();

      const pathToStorage = `imagens/receitas/${receita?.uid}/foto.png`;

      try {
        await storage().ref(pathToStorage).getDownloadURL();
        await storage().ref(pathToStorage).delete();
      } catch (e: any) {
        if (e.code !== 'storage/object-not-found') {
          throw e;
        }
      }

      return 'ok';
    } catch (e) {
      return 'Não foi possível excluir a receita. Por favor, contate o suporte técnico.';
    }
  };

  const atualizarFavorito = async (receita: Receita) => {
    try {
      await firestore().collection('receitas').doc(receita.uid).update({
        favorito: !receita.favorito,
      });

      setReceitas(prevReceitas =>
        prevReceitas.map(r =>
          r.uid === receita.uid ? {...r, favorito: !r.favorito} : r,
        ),
      );
    } catch (e) {
      console.error('ReceitaProvider, atualizarFavorito: ' + e);
    }
  };

  async function sendImageToStorage(
    receita: Receita,
    urlDevice: string,
  ): Promise<string> {
    try {
      let imageRedimencionada = await ImageResizer.createResizedImage(
        urlDevice,
        150,
        200,
        'PNG',
        80,
      );

      const pathToStorage = `imagens/receitas/${receita?.uid}/foto.png`;

      let url: string | null = '';
      const task = storage()
        .ref(pathToStorage)
        .putFile(imageRedimencionada?.uri);

      await task;
      url = await storage().ref(pathToStorage).getDownloadURL();

      return url;
    } catch (e) {
      console.error('ReceitaProvider, sendImageToStorage: ' + e);
      return '';
    }
  }

  return (
    <ReceitaContext.Provider
      value={{receitas, salvar, excluir, atualizarFavorito}}>
      {children}
    </ReceitaContext.Provider>
  );
};
