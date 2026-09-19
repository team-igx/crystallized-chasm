export class CrackShortcutCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly prompt: string,
    public readonly createdAt: Date,
  ) {}

  uglify(includeId: boolean): any {
    return {
      shortcutId: includeId ? this.id : undefined,
      name: this.name,
      description: this.description,
      prompt: this.prompt,
    };
  }

  static from(data: any): CrackShortcutCommand {
    return new CrackShortcutCommand(data.shortcutId, data.name, data.description, data.prompt, new Date(Date.parse(data.createdAt)));
  }
}
