export class CrackStyleProperties {
  constructor(
    public readonly mainColor: CrackStyleProperty,
    public readonly bubbleColor: CrackStyleProperty,
  ) {}
  static from(data: any): CrackStyleProperties {
    return new CrackStyleProperties(data["mainColor"], data["bubbleColor"]);
  }
}

export class CrackStyleProperty {
  constructor(
    public readonly lightColor: string,
    public readonly darkColor: string,
  ) {}

  static from(data: any): CrackStyleProperty {
    return new CrackStyleProperty(data["light"], data["dark"]);
  }
}
