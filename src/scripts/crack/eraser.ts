import { CRACK_VERSION_RULE } from "../../constants/script-constants";
import { CrackSdk } from "../../sdk/crack-sdk";
import { Nullable, Runnable } from "../../utils/generic-types";
import { BrowserInitUtil } from "../../utils/init-util";
import { NodeLocator } from "../../utils/node-locator-util";
import { NodeUtil } from "../../utils/node-util";
import { ScriptMetaUtil } from "../../utils/script-meta-util";

import TrashCan from "./svg/trash-can-destructive.svg?raw";
import Banana from "./svg/banana.png?inline";

import SCRIPT_STYLE from "./css/eraser.scss?inline";
import { readonlyLazy } from "../../utils/lazy-util";
import { LocaleStorageConfig } from "../../utils/local-storage-config";
import { ObserveUtil } from "../../utils/observe-util";

export const scriptMeta = ScriptMetaUtil.construct("crack", "eraser.user.js", undefined, (meta) => {
  meta.name = "Chasm Crystallized Eraser (결정화 캐즘 지우개)";
  meta.version = "CRCK-ERSR-v1.0.2p" satisfies CRACK_VERSION_RULE;
  meta.author = "milkyway0308";
  meta.description = "필요 없는 메인 추천 배너 선택 삭제. 이 기능은 결정화 캐즘 오리지널 패치입니다.";
  meta.match = ["https://crack.wrtn.ai/*"];
});

interface RemovableNode {
  key: string;
  root: HTMLElement;
  paragraph: HTMLParagraphElement;
}

const settings = readonlyLazy(
  () =>
    new LocaleStorageConfig<{
      removeMainCarousel: boolean;
      disabledItems: string[];
    }>("chasm-ersr-settings", {
      removeMainCarousel: false,
      disabledItems: [],
    }),
);

function constructDeleteButton(onClick: Runnable): HTMLButtonElement {
  return NodeUtil.setupNode("button", {
    cls: "chasm-eraser-button",
    onInit(node) {
      const doc = new DOMParser().parseFromString(TrashCan, "image/svg+xml");
      const element = doc.documentElement;
      element.setAttribute("width", "20");
      element.setAttribute("height", "20");
      node.append(
        NodeUtil.setupNode("div", {
          cls: "chasm-eraser-button-icon",
          onInit(iconNode) {
            iconNode.append(element);
          },
        }),
      );
      node.onclick = onClick;
    },
  });
}

function constructEmptyPage(): HTMLDivElement {
  return NodeUtil.setupNode("div", {
    cls: "chasm-eraser-empty",
    onInit(node) {
      node.id = "chasm-eraser-empty";
      node.append(
        NodeUtil.setupNode("img", {
          onInit(imageNode) {
            imageNode.className = "chasm-eraser-empty-banana";
            imageNode.src = Banana;
          },
        }),
      );
      node.append(
        NodeUtil.setupNode("span", {
          cls: "chasm-eraser-empty-narration",
          onInit(textNode) {
            textNode.innerHTML = "이제 이 곳은 텅 비었군요.<br/>벽에 붙은 바나나와 오직 당신뿐입니다.";
          },
        }),
      );
    },
  });
}

function fetchRemovableNode(node: HTMLElement): Nullable<RemovableNode> {
  const paragraphNode = node.querySelector<HTMLElement>(`
  :scope > :first-child > p:first-child,
  :scope > :first-child > :first-child > p:first-child,
  :scope > :first-child > :first-child > :first-child > p:first-child
  `);
  if (paragraphNode) {
    return { key: paragraphNode.textContent, root: node, paragraph: paragraphNode as HTMLParagraphElement };
  }
  return null;
}

function isRecommendationPage(url: URL | Location) {
  const query = new URLSearchParams(url.search);
  return CrackSdk.path().isDashboardPath(url) && (!query.has("pageId") || query.get("pageId") == "682c89c39d1325983179b65b");
}

function tick(url: URL | Location) {
  if (isRecommendationPage(url)) {
    let nonProceedCard = 0;
    const nodes = NodeLocator.getAll("div.flex.w-full.justify-center.flex-col.px-5.sm\\:px\\-0");
    if (settings.config.removeMainCarousel && nodes.length > 0) {
      (nodes[0].parentElement!.childNodes[0] as HTMLElement).setAttribute("chasm-eraser-carousel-deleted", "");
    }
    for (const node of nodes) {
      const data = fetchRemovableNode(node);
      if (data) {
        if (data.paragraph.hasAttribute("chasm-eraser-proceed")) {
          if (!data.root.hasAttribute("chasm-eraser-deleted")) {
            nonProceedCard++;
          }
          continue;
        }

        if (settings.config.disabledItems.includes(data.key)) {
          data.root.setAttribute("chasm-eraser-deleted", "");
        } else {
          nonProceedCard++;
        }
        data.paragraph.setAttribute("chasm-eraser-proceed", "");
        data.paragraph.append(
          constructDeleteButton(() => {
            data.root.setAttribute("chasm-eraser-deleted", "");
            settings.config.disabledItems.push(data.key);
            settings.save();
          }),
        );
      }
    }
    if (nodes.length > 0) {
      if (nonProceedCard > 0 || !settings.config.removeMainCarousel) {
        document.getElementById("chasm-eraser-empty")?.remove();
      } 
      
      if (nonProceedCard == 0 && settings.config.removeMainCarousel && !document.getElementById("chasm-eraser-empty")) {
        nodes[0].parentElement?.append(constructEmptyPage());
      }
    }
  }
}

function addMenu() {
  CrackSdk.addonModal().init();
  const manager = CrackSdk.addonModal().acquire();
  manager.createMenu("결정화 캐즘 지우개", (modal) => {
    modal.replaceContentPanel((panel) => {
      panel.addSwitchBox("ersr-remove-carousel", "카로셀 제거", "메인 추천 카로셀을 제거할지의 여부입니다.", {
        defaultValue: settings.config.removeMainCarousel,
        onChange: (value) => {
          settings.config.removeMainCarousel = value;
          settings.save();
          if (!value) {
            NodeLocator.getAll("[chasm-eraser-carousel-deleted]").forEach((it) => it.removeAttribute("chasm-eraser-carousel-deleted"));
          }
        },
      });

      panel.addBoxedButton("ersr-reset-state", "숨긴 메뉴 돌려놓기", "여기 당신의 메뉴가 있습니다", {
        onTrigger() {
          settings.config.disabledItems.splice(0, settings.config.disabledItems.length);
          settings.save();
          NodeLocator.getAll("[chasm-eraser-deleted]").forEach((it) => it.removeAttribute("chasm-eraser-deleted"));
        },
      });
    }, "결정화 캐즘 지우개");
  });
  manager.addLicenseDisplay((panel) => {
    panel.addTitleText("결정화 캐즘 지우개");
    panel.addText("- decentralized-modal.js 프레임워크 (https://github.com/milkyway0308/crystalized-chasm/decentralized-modal.js)");
  });
}

BrowserInitUtil.init(() => {
  settings.load();
  BrowserInitUtil.callGMAddStyle(SCRIPT_STYLE);
  addMenu();
  setInterval(() => {
    tick(location);
  }, 100);
  tick(location);
  ObserveUtil.attachHrefObserver((newUrl) => {
    tick(new URL(newUrl));
  });
});
