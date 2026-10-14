export class ShortUrlAlreadyExists extends Error {
  constructor() {
    super('Já existe um link com essa URL encurtada.')
    this.name = 'ShortUrlAlreadyExists'
  }
}
