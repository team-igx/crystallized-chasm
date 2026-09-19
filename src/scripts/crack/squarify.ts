import { CRACK_VERSION_RULE } from "../../constants/script-constants";
import { BrowserInitUtil } from "../../utils/init-util";
import { NodeLocator } from "../../utils/node-locator-util";
import { ObserveUtil } from "../../utils/observe-util";
import { ScriptMetaUtil } from "../../utils/script-meta-util";

export const scriptMeta = ScriptMetaUtil.construct("crack", "squarify.user.js", undefined, (meta) => {
  meta.name = "Chasm Crystallized Squarify (결정화 캐즘 제곱근)";
  meta.version = "CRCK-SQAR-v1.1.0p" satisfies CRACK_VERSION_RULE;
  meta.author = "milkyway0308";
  meta.description = "세션 목록 이미지 정사각형으로 조정. 이 기능은 결정화 캐즘 오리지널 패치입니다.";
});

const observerAttached = new WeakSet<Element>();
function tryAttachObserver() {
  const expectedSidebar = NodeLocator.get(`div[data-testid="virtuoso-scroller"]`);
  console.log("Sidebar: " + expectedSidebar);
  if (!expectedSidebar) return;
  if (observerAttached.has(expectedSidebar)) return;
  observerAttached.add(expectedSidebar);
  ObserveUtil.attachObserver(expectedSidebar, () => {
    for (const imageNode of NodeLocator.byAll(expectedSidebar, 'canvas[width="46"][height="46"]')) {
        console.log("Scanning..");
      if (!imageNode.hasAttribute("chasm-sqar-modified")) {
        imageNode.setAttribute("chasm-sqar-modified", "true");
        imageNode.parentElement?.classList.add("chasm-sqar-squarify");
      }
    }
  });
}

BrowserInitUtil.init(() => {
  tryAttachObserver();
  setInterval(tryAttachObserver, 50);
//   const debouncer = DelayUtil.debouncer(tryAttachObserver);
//   ObserveUtil.attachObserver(document, () => debouncer.runDebouncer(50));

  BrowserInitUtil.callGMAddStyle(`
        .chasm-sqar-squarify {
            width: 48px !important;
            height: 48px !important;
            border-radius: 0px !important;
        }        
    `);
});
