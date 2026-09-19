import { Consumer, Nullable, Runnable } from "./generic-types";

export class ObserveUtil {
  /**
   * 지정한 노드 혹은 요소에 변경 옵저버를 등록합니다.
   * @param observeTarget 변경 감지 대상
   * @param lambda 실행할 람다. 파라미터로 옵저버 종료 핸들러가 제공됩니다.
   * @returns 옵저버 종료 핸들러
   */
  static attachObserver(observeTarget: Node, lambda: Consumer<() => void>): Nullable<() => void> {
    const Observer = window.MutationObserver || (window as any).WebKitMutationObserver;
    if (observeTarget && Observer) {
      let instance = new Observer(() => {
        lambda(() => {
          instance.disconnect();
        });
      });
      instance.observe(observeTarget, {
        childList: true,
        subtree: true,
        attributes: true,
      });
      return () => {
        instance.disconnect();
      };
    }
    return null;
  }
  
  private static attachLegacyHrefObserver(lambda: (newUrl: string, oldUrl: string) => void) {
    let oldUrl = location.href;
    const changed = () => {
      const newUrl = location.href;
      if (newUrl !== oldUrl) {
        const prevUrl = oldUrl;
        oldUrl = newUrl;
        lambda(newUrl, prevUrl);
      }
    };
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      const result = originalPushState.apply(this, args as any);
      changed();
      return result;
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args as any);
      changed();
      return result;
    };
    window.addEventListener("popstate", changed);
    window.addEventListener("hashchange", changed);
  }

  /**
   * 지정한 노드 혹은 요소에 URL 변동 감지성 변경 옵저버를 등록합니다.
   * 이 펑션으로 등록된 옵저버는 이전과 현재 URL이 다를때만 작동합니다.
   * @param node 변경 감지 대상. 첫 인자로는 이동URL, 두번쨰 인자로는 이전 URL을 반환합니다.
   * @param lambda 실행할 람다
   */
  static attachHrefObserver(lambda: (newUrl: string, oldUrl: string) => void) {
    let oldUrl = location.href;
    const navigation = (window as any).navigation;
    if (navigation) {
      navigation.addEventListener("navigate", (event: any) => {
        const newUrl = event.destination.url;
        if (oldUrl !== newUrl) {
          const prevUrl = oldUrl;
          oldUrl = newUrl;
          lambda(newUrl, prevUrl);
        }
      });
      return;
    }
    this.attachLegacyHrefObserver(lambda);
  }

  /**
   * 페이지가 준비되면 제공된 람다 펑션이 실행되도록 설정합니다.
   * @param {() => any} runner 실행될 람다 펑션
   */
  static onPageReady(runner: Runnable) {
    ("loading" === document.readyState ? document.addEventListener("DOMContentLoaded", runner) : runner(), window.addEventListener("load", runner));
  }

  static attachResizeObserver(observerTarget: Element, lambda: Runnable): Runnable {
    const observer = new ResizeObserver(lambda);
    observer.observe(observerTarget);
    return () => {
      observer.unobserve(observerTarget);
    };
  }
}
