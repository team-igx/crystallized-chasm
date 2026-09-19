// ==UserScript==
// @name         Chasm Crystallized Squarify (결정화 캐즘 제곱근)
// @namespace    https://github.com/milkyway0308
// @version      CRCK-SQAR-v1.1.0p
// @author       milkyway0308
// @description  세션 목록 이미지 직사각형으로 조정. 이 기능은 결정화 캐즘 오리지널 패치입니다.
// @downloadURL  https://github.com/milkyway0308/crystallized-chasm/dist/crack/squarify.user.js
// @updateURL    https://github.com/milkyway0308/crystallized-chasm/dist/crack/squarify.user.js
// @match        https://crack.wrtn.ai/*
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// ==/UserScript==

(function () {
    'use strict';

    class c{static init(e){typeof document<"u"&&e();}static onPagePrepare(e){let n=false;const t=()=>{n||(n=true,e());};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",t):t(),window.addEventListener("load",t);}static callGMAddStyle(e){return typeof GM_addStyle<"u"?(GM_addStyle(e),true):false}static callGMGetResourceUrl(e){if(typeof GM_getResourceURL<"u")return GM_getResourceURL(e)}}function v(r,e){return r?r.querySelector(e):null}function y(r,e){return r?Array.from(r.querySelectorAll(e)):[]}function f(r){return document.querySelector(r)}function h(r){return Array.from(document.querySelectorAll(r))}function b(r,e,n){const t=f(r);return e?t?n(t):null:n(t)}function p(r,e,n){const t=h(r);return e?t.length>0?n(t):null:n(t)}const l={get:f,getAll:h,on:b,onAll:p,by:v,byAll:y};class g{static attachObserver(e,n){const t=window.MutationObserver||window.WebKitMutationObserver;if(e&&t){let i=new t(()=>{n(()=>{i.disconnect();});});return i.observe(e,{childList:true,subtree:true,attributes:true}),()=>{i.disconnect();}}return null}static attachLegacyHrefObserver(e){let n=location.href;const t=()=>{const a=location.href;if(a!==n){const s=n;n=a,e(a,s);}},i=history.pushState;history.pushState=function(...a){const s=i.apply(this,a);return t(),s};const o=history.replaceState;history.replaceState=function(...a){const s=o.apply(this,a);return t(),s},window.addEventListener("popstate",t),window.addEventListener("hashchange",t);}static attachHrefObserver(e){let n=location.href;const t=window.navigation;if(t){t.addEventListener("navigate",i=>{const o=i.destination.url;if(n!==o){const a=n;n=o,e(o,a);}});return}this.attachLegacyHrefObserver(e);}static onPageReady(e){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e(),window.addEventListener("load",e);}static attachResizeObserver(e,n){const t=new ResizeObserver(n);return t.observe(e),()=>{t.unobserve(e);}}}const d=new WeakSet;function u(){const r=l.get('div[data-testid="virtuoso-scroller"]');console.log("Sidebar: "+r),r&&(d.has(r)||(d.add(r),g.attachObserver(r,()=>{for(const e of l.byAll(r,'canvas[width="46"][height="46"]'))console.log("Scanning.."),e.hasAttribute("chasm-sqar-modified")||(e.setAttribute("chasm-sqar-modified","true"),e.parentElement?.classList.add("chasm-sqar-squarify"));})));}c.init(()=>{u(),setInterval(u,50),c.callGMAddStyle(`
        .chasm-sqar-squarify {
            width: 48px !important;
            height: 48px !important;
            border-radius: 0px !important;
        }        
    `);});

})();