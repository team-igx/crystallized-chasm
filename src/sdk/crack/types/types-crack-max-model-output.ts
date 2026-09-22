export class CrackMaxModelOutput {
  constructor(
    public readonly defaultMaxOutput: number,
    public readonly crackerPerHundredToken: number,
  ) {}

  static from(data: any): CrackMaxModelOutput {
    return new CrackMaxModelOutput(data["defaultMaxOutput"], data["crackerPer100Token"]);
  }
}
