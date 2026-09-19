import { Undeclarable } from "../../../utils/generic-types";

export class CrackOnlyState {
  constructor(
    /** 크랙온리 여부 */
    public readonly isOnlyContent: boolean,
    /** 플랫폼 측의 조치로 인한 편집 불가능 여부 */
    public readonly isLocked: boolean,
  ) {}

  static from(data: Undeclarable<any>): CrackOnlyState {
    if (!data) return new CrackOnlyState(false, false);
    return new CrackOnlyState(data["isOnlyContent"] ?? false, data["isLocked"] ?? false);
  }
}
