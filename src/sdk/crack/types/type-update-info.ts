import { Undeclarable } from "../../../utils/generic-types";

export class CrackUpdateInfo {
  constructor(
    /** 현재 버전 */
    public readonly version: number,
    /** 현재 버전의 업데이트 시간 */
    public readonly releasedAt: Date,
  ) {}

  static from(data: Undeclarable<any>): CrackUpdateInfo {
    if (!data) return new CrackUpdateInfo(-1, new Date());
    return new CrackUpdateInfo(data.version, new Date(Date.parse(data.releasedAt)));
  }
}
