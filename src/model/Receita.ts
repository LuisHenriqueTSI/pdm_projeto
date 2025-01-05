export class Receita {
  public uid: string;
  public nome: string;
  public descricao: string;
  public ingredientes: string;
  public favorito: boolean;
  public urlFoto: string;
  public dificuldade: string;
  public tempoPreparo: number;
  public categoria: string;

  constructor(
    uid: string,
    nome: string,
    descricao: string,
    ingredientes: string,
    favorito: boolean = false,
    urlFoto: string,
    dificuldade: string,
    tempoPreparo: number = 0,
    categoria: string,
  ) {
    this.uid = uid;
    this.nome = nome;
    this.descricao = descricao;
    this.ingredientes = ingredientes;
    this.favorito = favorito;
    this.urlFoto = urlFoto;
    this.dificuldade = dificuldade;
    this.tempoPreparo = tempoPreparo;
    this.categoria = categoria;
  }
}
