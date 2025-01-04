export class Receita {
  public uid: string;
  public nome: string;
  public descricao: string;
  public ingredientes: string;
  public latitude: number;
  public longitude: number;
  public urlFoto: string;
  constructor(
    uid: string,
    nome: string,
    descricao: string,
    ingredientes: string,
    latitude: number,
    longitude: number,
    urlFoto: string,
  ) {
    this.uid = uid;
    this.nome = nome;
    this.descricao = descricao;
    this.ingredientes = ingredientes;
    this.latitude = latitude;
    this.longitude = longitude;
    this.urlFoto = urlFoto;
  }
}
