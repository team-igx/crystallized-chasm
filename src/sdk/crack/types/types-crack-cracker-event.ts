import { MissingComponentError } from "../../../utils/error-utils";

export class CrackCrackerEvent {
  constructor(
    public readonly start: Date,
    public readonly end: Date,
    public readonly discount: number,
    public readonly timeRange: Date[],
    public readonly isActive: boolean,
  ) {}

  static from(data: any) {
    return new CrackCrackerEvent(
      new Date(MissingComponentError.ensureString("Crack Model Type Event Deserialization", "startDate", data)),
      new Date(MissingComponentError.ensureString("Crack Model Type Event Deserialization", "endDate", data)),
      MissingComponentError.ensureNumber("Crack Model Type Event Deserialization", "discountedCrackerQuantity", data),
      (MissingComponentError.ensureArray<string>("Crack Model Type Event Deserialization", "timeRanges", false) ?? []).map((it) => new Date(it)),
      MissingComponentError.ensureBool("Crack Model Type Event Deserialization", "isDiscountActive", data),
    );
  }
}
