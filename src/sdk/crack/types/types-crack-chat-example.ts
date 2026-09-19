export class CrackChatExample {
  constructor(
    /** 사용자 예제 입력 */
    public readonly user: string,
    /** 봇 예제 응답 */
    public readonly character: string,
  ) {}

  static from(data: any): CrackChatExample {
    return new CrackChatExample(data["user"], data["character"]);
  }
}
