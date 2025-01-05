import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import * as yup from 'yup';
import {ReceitaContext} from '../context/ReceitaProvider';
import {Receita} from '../model/Receita';

const requiredMessage = 'Campo obrigatório';
const schema = yup.object().shape({
  nome: yup
    .string()
    .required(requiredMessage)
    .min(2, 'O nome deve ter ao menos 2 caracteres'),
  descricao: yup
    .string()
    .required(requiredMessage)
    .min(2, 'A descricao deve ter ao menos 2 caracteres'),
  ingredientes: yup
    .string()
    .required(requiredMessage)
    .min(2, 'Ingredientes devem ter ao menos 2 caracteres'),
  dificuldade: yup.string().required(requiredMessage),
  tempoPreparo: yup
    .number()
    .required(requiredMessage)
    .positive('O tempo deve ser positivo')
    .integer('O tempo deve ser um número inteiro'),
  categoria: yup.string().required(requiredMessage),
});

export default function ReceitaTela({route, navigation}: any) {
  const [receita, _setReceita] = useState<Receita | null>(route.params.receita);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      nome: receita?.nome || '',
      descricao: receita?.descricao || '',
      ingredientes: receita?.ingredientes || '',
      dificuldade: receita?.dificuldade || '',
      tempoPreparo: receita?.tempoPreparo || 0,
      categoria: receita?.categoria || '',
      favorito: receita?.favorito || false,
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
  const [requisitando, setRequisitando] = useState(false);
  const [urlDevice, setUrlDevice] = useState<string | undefined>(
    receita?.urlFoto || '',
  );
  const [atualizando, setAtualizando] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});
  const [dialogErroVisivel, setDialogErroVisivel] = useState(false);
  const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
  const {salvar, excluir} = useContext<any>(ReceitaContext);
  const [excluindo, setExcluindo] = useState(false);

  async function atualizar(data: Receita) {
    // Se favorito não for passado, atribua false
    data.favorito = data.favorito !== undefined ? data.favorito : false;

    data.uid = receita?.uid || '';
    data.urlFoto =
      urlDevice ||
      receita?.urlFoto ||
      'https://raw.githubusercontent.com/LuisHenriqueTSI/repo_imagens/refs/heads/main/comida-padrao.png';

    setRequisitando(true);
    setAtualizando(true);

    const msg = await salvar(data, urlDevice || '');
    if (msg === 'ok') {
      setMensagem({
        tipo: 'ok',
        mensagem: 'Show! Operação realizada com sucesso.',
      });
      setDialogErroVisivel(true);
    } else {
      setMensagem({tipo: 'erro', mensagem: msg});
      setDialogErroVisivel(true);
    }

    setRequisitando(false);
    setAtualizando(false);
  }
  function avisarDaExclusaoPermanenteDoRegistro() {
    setDialogExcluirVisivel(true);
  }

  async function excluirReceita() {
    setDialogExcluirVisivel(false);
    setRequisitando(true);
    setExcluindo(true);
    const msg = await excluir(receita);
    if (msg === 'ok') {
      setMensagem({
        tipo: 'ok',
        mensagem: 'A receita foi excluída com sucesso.',
      });
      setDialogErroVisivel(true);
    } else {
      setMensagem({tipo: 'erro', mensagem: 'ops! algo deu errado'});
      setDialogErroVisivel(true);
    }
    setRequisitando(false);
    setExcluindo(false);
  }

  const buscaNaGaleria = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (response.errorCode) {
        setMensagem({tipo: 'erro', mensagem: 'Ops! Erro ao buscar a imagem.'});
      } else if (response.didCancel) {
        setMensagem({tipo: 'ok', mensagem: 'Ok, você cancelou.'});
      } else {
        const path = response.assets?.[0].uri;
        setUrlDevice(path); // armazena a uri para a imagem no device
      }
    });
  };

  function tiraFoto() {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchCamera(options, response => {
      if (response.errorCode) {
        setMensagem({tipo: 'erro', mensagem: 'Ops! Erro ao tirar a foto'});
      } else if (response.didCancel) {
        setMensagem({tipo: 'ok', mensagem: 'Ok, você cancelou.'});
      } else {
        const path = response.assets?.[0].uri;
        setUrlDevice(path); // armazena a uri para a imagem no device
      }
    });
  }

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <ScrollView>
        <>
          <Image
            style={styles.image}
            source={
              urlDevice !== ''
                ? {uri: urlDevice}
                : receita && receita?.urlFoto !== ''
                ? {uri: receita.urlFoto}
                : require('../assets/images/logo512.png')
            }
            loadingIndicatorSource={require('../assets/images/person.png')}
          />
          <View style={styles.divButtonsImage}>
            <Button
              style={styles.buttonImage}
              mode="outlined"
              icon="image"
              onPress={buscaNaGaleria}>
              Galeria
            </Button>
            <Button
              style={styles.buttonImage}
              mode="outlined"
              icon="camera"
              onPress={tiraFoto}>
              Foto
            </Button>
          </View>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Nome da Receita"
                placeholder=""
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="food" />}
              />
            )}
            name="nome"
          />
          {errors.nome && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.nome?.message?.toString()}
            </Text>
          )}
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Descrição"
                placeholder=""
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
                keyboardType="default"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="text" />}
              />
            )}
            name="descricao"
          />
          {errors.descricao && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.descricao?.message?.toString()}
            </Text>
          )}
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Ingredientes"
                placeholder=""
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="format-list-bulleted" />}
              />
            )}
            name="ingredientes"
          />
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Tempo de Preparo (min)"
                placeholder="Ex: 30"
                keyboardType="number-pad"
                mode="outlined"
                onChangeText={onChange}
                value={String(value)}
                right={<TextInput.Icon icon="clock-outline" />}
              />
            )}
            name="tempoPreparo"
          />
          {errors.tempoPreparo && (
            <Text style={styles.textError}>
              {errors.tempoPreparo?.message?.toString()}
            </Text>
          )}

          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Dificuldade"
                placeholder="Ex: Fácil"
                mode="outlined"
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="chart-bar" />}
              />
            )}
            name="dificuldade"
          />
          {errors.dificuldade && (
            <Text style={styles.textError}>
              {errors.dificuldade?.message?.toString()}
            </Text>
          )}

          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.textinput}
                label="Categoria"
                placeholder="Ex: Sobremesa"
                mode="outlined"
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="silverware-fork-knife" />}
              />
            )}
            name="categoria"
          />
          {errors.categoria && (
            <Text style={styles.textError}>
              {errors.categoria?.message?.toString()}
            </Text>
          )}

          {errors.ingredientes && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.ingredientes?.message?.toString()}
            </Text>
          )}
          <Button
            style={styles.button}
            mode="contained"
            onPress={handleSubmit(atualizar)}
            loading={requisitando}
            disabled={requisitando}>
            {!atualizando ? 'Salvar' : 'Salvando'}
          </Button>
          <Button
            style={styles.buttonOthers}
            mode="outlined"
            onPress={avisarDaExclusaoPermanenteDoRegistro}
            loading={requisitando}
            disabled={requisitando}>
            {!excluindo ? 'Excluir' : 'Excluindo'}
          </Button>
        </>
      </ScrollView>

      {/* Diálogo de erro */}
      <Dialog
        visible={dialogErroVisivel}
        onDismiss={() => {
          setDialogErroVisivel(false);
          if (mensagem.tipo === 'ok') {
            navigation.goBack();
          }
        }}>
        <Dialog.Icon
          icon={
            mensagem.tipo === 'ok'
              ? 'checkbox-marked-circle-outline'
              : 'alert-circle-outline'
          }
          size={60}
        />
        <Dialog.Title style={styles.textDialog}>
          {mensagem.tipo === 'ok' ? 'Informação' : 'Erro'}
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {mensagem.mensagem}
          </Text>
        </Dialog.Content>
      </Dialog>

      {/* Diálogo de exclusão */}
      <Dialog
        visible={dialogExcluirVisivel}
        onDismiss={() => {
          setDialogExcluirVisivel(false);
        }}>
        <Dialog.Icon icon={'alert-circle-outline'} size={60} />
        <Dialog.Title style={styles.textDialog}>{'Ops!'}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {
              'Você tem certeza que deseja excluir esse registro?\nEsta operação será irreversível.'
            }
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogExcluirVisivel(false)}>
            Cancelar
          </Button>
          <Button onPress={excluirReceita}>Excluir</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    borderRadius: 10,
  },
  divButtonsImage: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  buttonImage: {
    margin: 5,
    width: 120,
  },
  textinput: {
    marginBottom: 15,
    width: '100%',
  },
  button: {
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
  },
  buttonOthers: {
    marginBottom: 10,
    width: '100%',
  },
  textError: {
    marginBottom: 10,
    fontSize: 14,
  },
  textDialog: {
    fontSize: 16,
  },
});
