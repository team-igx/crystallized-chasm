import { Undeclarable } from "../../../utils/generic-types";

export class CrackOriginalState {
  constructor(
    /** 오리지널 여부 */
    public readonly isOriginal: boolean,
    /** 플랫폼 측의 조치로 인한 편집 불가능 여부 */
    public readonly isEditBlocked: boolean,
    /** 팬픽 활성화 여부 */
    public readonly isFanficEnabled: boolean,
  ) {}

  static from(data: Undeclarable<any>): CrackOriginalState {
    if (!data) return new CrackOriginalState(false, false, false);
    return new CrackOriginalState(data["isOriginal"] ?? false, data["isEditBlocked"] ?? false, data["isFanficEnabled"] ?? false);
  }
}
