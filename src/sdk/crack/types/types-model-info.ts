import { MissingComponentError } from "../../../utils/error-utils";
import { CrackMaxModelOutput } from "./types-crack-max-model-output";
import { CrackStyleProperties } from "./types-crack-style-properties";
import { CrackImageMappable } from "./types-generic";

export class CrackModelInfo {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly crackerQuantity: number,
    public readonly crackerModel: string,
    public readonly isBeta: boolean,
    public readonly isBlocked: boolean,
    public readonly isDefault: boolean,
    public readonly serviceType: string,
    public readonly assets: CrackImageMappable,
    public readonly styleProperties: CrackStyleProperties,
    public readonly replacementChatModelId: string,
    public readonly deprecateAnnouncementId: string,
    public readonly maxOutput: CrackMaxModelOutput,
    public readonly isCreatorRecommended: boolean,
    public readonly isThinkingSupported: boolean,
    public readonly isFreeChatPassApplicable: boolean,
  ) {}

  static from(data: any): CrackModelInfo {
    return new CrackModelInfo(
      MissingComponentError.ensureString("Crack Model Type Deserialization", "_id", data),
      MissingComponentError.ensureString("Crack Model Type Deserialization", "name", data),
      MissingComponentError.ensureString("Crack Model Type Deserialization", "description", data),
      MissingComponentError.ensureNumber("Crack Model Type Deserialization", "crackerQuantity", data),
      MissingComponentError.ensureString("Crack Model Type Deserialization", "crackerModel", data),
      MissingComponentError.ensureBool("Crack Model Type Deserialization", "isBeta", data),
      MissingComponentError.ensureBool("Crack Model Type Deserialization", "isBlock", data),
      MissingComponentError.ensureBool("Crack Model Type Deserialization", "isDefault", data),
      MissingComponentError.ensureString("Crack Model Type Deserialization", "serviceType", data),
      new CrackImageMappable(data.assets),
      CrackStyleProperties.from(data.styleProperties),
      MissingComponentError.ensureString("Crack Model Type Deserialization", "replacementChatModelId", data),
      MissingComponentError.ensureString("Crack Model Type Deserialization", "deprecateAnnouncementId", data),
      CrackMaxModelOutput.from(data.maxOutput),
      MissingComponentError.ensureBool("Crack Model Type Deserialization", "isCreatorRecommended", data),
      MissingComponentError.ensureBool("Crack Model Type Deserialization", "isThinkingSupported", data),
      MissingComponentError.ensureBool("Crack Model Type Deserialization", "isFreeChatPassApplicable", data),
    );
  }
}
