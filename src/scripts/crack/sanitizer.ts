import { CRACK_VERSION_RULE } from "../../constants/script-constants";
import { CrackSdk } from "../../sdk/crack-sdk";
import { Undeclarable } from "../../utils/generic-types";
import { BrowserInitUtil } from "../../utils/init-util";
import { readonlyLazy } from "../../utils/lazy-util";
import { LocaleStorageConfig } from "../../utils/local-storage-config";
import { LogUtil } from "../../utils/log-utils";
import { NodeLocator } from "../../utils/node-locator-util";
import { ObserveUtil } from "../../utils/observe-util";
import { ScriptMetaUtil } from "../../utils/script-meta-util";
import SCRIPT_STYLE from "./css/sanitizer.scss?inline";

export const scriptMeta = ScriptMetaUtil.construct("crack", "sanitizer.user.js", undefined, (meta) => {
  meta.name = "Chasm Crystallized Sanitizer (결정화 캐즘 손소독제)";
  meta.version = "CRCK-SANI-v2.1.0p" satisfies CRACK_VERSION_RULE;
  meta.author = "milkyway0308";
  meta.description = "필요 없는 광고 배너 제거. 손도 아주 깔끔!";
});

// =====================================================
//                      설정
// =====================================================
const settings = new LocaleStorageConfig<{
  removeAppBanner: Undeclarable<boolean>;
  removeAutoPurchaseBanner: Undeclarable<boolean>;
}>("chasm-crck-san-settings", {
  removeAppBanner: true,
  removeAutoPurchaseBanner: true,
});

// =====================================================
//                        상수
// =====================================================

const logger = readonlyLazy(() => new LogUtil("Sanitizer", false));
const SANITIZER_REMOVAL_KEY = "chasm-sani-disabled";

// =====================================================
//                        로직
// =====================================================

function monitor() {
  if (settings.config.removeAppBanner && CrackSdk.environment().isMobile()) {
    let scannerIndex = 0;
    for (let element of NodeLocator.getAll<HTMLDivElement>('div[height="64"]')) {
      if (++scannerIndex >= 5) return;
      for (let button of element.getElementsByTagName("button")) {
        if (button.textContent === "다운로드") {
          (button.nextSibling as HTMLElement)?.click();
          logger.log("모바일 권유 배너 1개를 제거하였습니다.");
          return;
        }
      }
    }
  }
}

function hrefMonitor() {
  if (settings.config.removeAutoPurchaseBanner && CrackSdk.path().isCrackerPath()) {
    const selected = NodeLocator.getAll<HTMLImageElement>('img[src="https://cdn-image.static.wrtn.ai/crack/cracker-page-ticket.svg"]');
    if (selected.length > 0 && selected[0].parentElement?.hasAttribute(SANITIZER_REMOVAL_KEY) == false) {
      selected[0].parentElement?.setAttribute(SANITIZER_REMOVAL_KEY, "true");
          logger.log("자동 구매 권유 배너 1개를 제거하였습니다.");
    }
  }
}

// =================================================
//                  초기화
// =================================================

function addMenu() {
  CrackSdk.addonModal()
    .acquire()
    .addLicenseDisplay((panel) => {
      panel.addTitleText("결정화 캐즘 손소독제");
      panel.addText("- decentralized-modal.js 프레임워크 사용 (https://github.com/milkyway0308/crystalized-chasm/decentralized.js)");
    });
}

BrowserInitUtil.init(() => {
  settings.load();
  addMenu();
  BrowserInitUtil.callGMAddStyle(SCRIPT_STYLE);
  hrefMonitor();
  BrowserInitUtil.onPagePrepare(() => {
    ObserveUtil.attachObserver(document.body, monitor);
    ObserveUtil.attachHrefObserver(document.body, hrefMonitor);
    monitor();
    hrefMonitor();
  });
});
