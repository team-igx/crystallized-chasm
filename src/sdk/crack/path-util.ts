import { Nullable, Undeclarable } from "../../utils/generic-types";

export enum CrackerTabType {
  /** 결제 페이지 */
  PURCHASE,
  /** 자동 결제 페이지 */
  AUTO_PURCHASE,
  /** 출석 체크 페이지 */
  ATTEND,
}
/**
 * 현재 URL이 크랙 대시보드 URL인지 반환합니다.
 * @param [url=location] 대상 URL. 지정되지 않았을 경우, 현재 웹 페이지의 URL을 기준으로 합니다.
 * @returns 대시보드 여부
 */
function isDashboardPath(url: URL | Location = location): boolean {
  return "/" === url.pathname;
}

/**
 * 현재 URL이 스토리챗의 URL인지 반환합니다.
 * @param [url=location] 대상 URL. 지정되지 않았을 경우, 현재 웹 페이지의 URL을 기준으로 합니다.
 * @returns 채팅 URL 일치 여부
 */
function isStoryPath(url: URL | Location = location): boolean {
  // 2025-09-17 Path
  return (
    /\/stories\/[a-f0-9]+\/episodes\/[a-f0-9]+/.test(url.pathname) ||
    // Legacy Path
    /\/u\/[a-f0-9]+\/c\/[a-f0-9]+/.test(url.pathname)
  );
}

/**
 * 현재 URL이 캐릭터챗의 URL인지 반환합니다.
 * @param [url=location] 대상 URL. 지정되지 않았을 경우, 현재 웹 페이지의 URL을 기준으로 합니다.
 * @returns 채팅 URL 일치 여부
 */
function isCharacterPath(url: URL | Location = location): boolean {
  return /\/characters\/[a-f0-9]+\/chats\/[a-f0-9]+/.test(url.pathname);
}

/**
 * 현재 URL이 스토리챗 빌더의 URL인지 반환합니다.
 * @param [url=location] 대상 URL. 지정되지 않았을 경우, 현재 웹 페이지의 URL을 기준으로 합니다.
 * @returns 채팅 URL 일치 여부
 */
function isStoryBuilderPath(url: URL | Location = location) {
  return /^\/builder\/story(\/.*)?$/.test(url.pathname);
}

/**
 * 현재 URL이 ARPG 채팅의 일부인지 반환합니다.
 * @param [url=location] 대상 URL. 지정되지 않았을 경우, 현재 웹 페이지의 URL을 기준으로 합니다.
 * @returns 채팅 URL 일치 여부
 */
function isARPGPath(url: URL | Location = location): boolean {
  return /\/arpg\/[a-f0-9]+\/[a-f0-9]+\/play/.test(url.pathname);
}

/**
 * 현재 URL이 ARPG 채팅 빌더의 일부인지 반환합니다.
 * @param [url=location] 대상 URL. 지정되지 않았을 경우, 현재 웹 페이지의 URL을 기준으로 합니다.
 * @returns 채팅 URL 일치 여부
 */
function isARPGBuilderPath(url: URL | Location = location): boolean {
  return /\/arpg\/[a-f0-9]+\/builder/.test(url.pathname);
}

/**
 * 현재 URL이 크래커 결제 페이지인지 확인합니다.
 * @param type 크래커 페이지 내 탭 타입, 혹은 undefined. undefined는 와일드 카드로 처리됩니다.
 * @param [url=location] 대상 URL. 지정되지 않았을 경우, 현재 웹 페이지의 URL을 기준으로 합니다.
 * @returns 페이지 및 옵션 일치 여부
 */
function isCrackerPath(type: Undeclarable<CrackerTabType> = undefined, url: URL | Location = location): boolean {
  if (url.pathname != "/cracker") return false;
  if (type != undefined) {
    switch (type) {
      case CrackerTabType.PURCHASE: {
        return new URLSearchParams(url.search).get("tab") == "purchase";
      }
      case CrackerTabType.ATTEND: {
        return new URLSearchParams(url.search).get("tab") == "free";
      }
      case CrackerTabType.AUTO_PURCHASE: {
        return new URLSearchParams(url.search).get("tab") == "auto-purchase";
      }
    }
  }
  return true;
}

/**
 * 현재 URL이 크랙 채팅 URL인지 반환합니다.
 * @param [url=location] 대상 URL. 지정되지 않았을 경우, 현재 웹 페이지의 URL을 기준으로 합니다.
 * @returns 채팅 URL 일치 여부
 */
function isChattingPath(): boolean {
  return isStoryPath() || isCharacterPath();
}

/**
 * 현재 스토리 / 캐릭터 ID를 반환합니다.
 * @param [url=location] 대상 URL. 지정되지 않았을 경우, 현재 웹 페이지의 URL을 기준으로 합니다.
 * @returns 현재 캐릭터 / 스토리 ID
 */
function character(url: URL | Location = location): Nullable<string> {
  if (isChattingPath()) {
    const split = url.pathname.substring(1).split("/");
    const characterId = split[1];
    return characterId;
  }
  return null;
}

/**
 * 현재 채팅방 ID를 반환합니다.
 * @param [url=location] 대상 URL. 지정되지 않았을 경우, 현재 웹 페이지의 URL을 기준으로 합니다.
 * @returns 현재 채팅방 ID
 */
function chatRoom(url: URL | Location = location): Nullable<string> {
  if (isChattingPath()) {
    const split = url.pathname.substring(1).split("/");
    const chatRoomId = split[3];
    return chatRoomId;
  }
  return null;
}

export const CrackPathApi = {
  isStoryBuilderPath,
  isDashboardPath,
  isStoryPath,
  isCharacterPath,
  isChattingPath,
  isARPGPath,
  isARPGBuilderPath,
  isCrackerPath,
  character,
  chatRoom,
} as const;
