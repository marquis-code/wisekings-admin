import { _ as __nuxt_component_0 } from './nuxt-link-j7LYAefj.mjs';
import { _ as _export_sfc, e as useRoute, d as useAuthState, b as useToast, c as __nuxt_component_1 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, Transition, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAuthApi } from './useAuthApi-Cz5TjfSb.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'vue-router';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const sidebarOpen = ref(true);
    const userMenuOpen = ref(false);
    ref();
    const { user } = useAuthState();
    useAuthApi();
    useToast();
    const initials = computed(() => {
      var _a;
      if (!((_a = user.value) == null ? void 0 : _a.fullName)) return "?";
      return user.value.fullName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    });
    const pageTitle = computed(() => {
      const path = route.path;
      const titles = {
        "/": "Dashboard",
        "/merchants": "Merchants",
        "/partners": "Partners",
        "/products": "Products",
        "/categories": "Categories",
        "/orders": "Orders",
        "/commissions": "Commissions",
        "/wallets/withdrawals": "Withdrawals",
        "/users": "Users & Staff",
        "/roles": "Roles & Permissions",
        "/audit": "Audit Trail",
        "/notifications": "Notifications",
        "/settings": "Settings"
      };
      return titles[path] || "WiseKings Admin";
    });
    const navItems = [
      { label: "Dashboard", icon: "lucide:layout-dashboard", path: "/" },
      { separator: true, label: "Commerce" },
      { label: "Products", icon: "lucide:package", path: "/products" },
      { label: "Categories", icon: "lucide:tags", path: "/categories" },
      { label: "Orders", icon: "lucide:shopping-cart", path: "/orders" },
      { separator: true, label: "Network" },
      { label: "Merchants", icon: "lucide:store", path: "/merchants" },
      { label: "Partners", icon: "lucide:handshake", path: "/partners" },
      { label: "Commissions", icon: "lucide:percent", path: "/commissions" },
      { separator: true, label: "Finance" },
      { label: "Withdrawals", icon: "lucide:wallet", path: "/wallets/withdrawals" },
      { separator: true, label: "System" },
      { label: "Users & Staff", icon: "lucide:users", path: "/users" },
      { label: "Roles", icon: "lucide:shield", path: "/roles" },
      { label: "Audit Trail", icon: "lucide:clipboard-list", path: "/audit" },
      { label: "Notifications", icon: "lucide:bell", path: "/notifications" },
      { label: "Settings", icon: "lucide:settings", path: "/settings" }
    ];
    function isActive(path) {
      if (path === "/") return route.path === "/";
      return route.path.startsWith(path);
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-screen overflow-hidden bg-dark-950" }, _attrs))} data-v-67c37feb><aside class="${ssrRenderClass([
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-dark-900 border-r border-dark-700 transition-all duration-300",
        unref(sidebarOpen) ? "w-64" : "w-20"
      ])}" data-v-67c37feb><div class="flex items-center h-16 px-4 border-b border-dark-700" data-v-67c37feb><div class="flex items-center gap-3" data-v-67c37feb><div class="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-bold text-white text-sm" data-v-67c37feb> WK </div>`);
      if (unref(sidebarOpen)) {
        _push(`<span class="text-lg font-bold text-white whitespace-nowrap" data-v-67c37feb> WiseKings </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1" data-v-67c37feb><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(`<!--[-->`);
        if (item.separator) {
          _push(`<div class="pt-4 pb-2" data-v-67c37feb>`);
          if (unref(sidebarOpen)) {
            _push(`<p class="px-3 text-[10px] font-semibold text-dark-500 uppercase tracking-widest" data-v-67c37feb>${ssrInterpolate(item.label)}</p>`);
          } else {
            _push(`<div class="border-b border-dark-700 mx-2" data-v-67c37feb></div>`);
          }
          _push(`</div>`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: item.path,
            class: [
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              isActive(item.path) ? "bg-primary-600/10 text-primary-400 border border-primary-500/20" : "text-dark-400 hover:text-dark-200 hover:bg-dark-800"
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_Icon, {
                  name: item.icon,
                  class: "w-5 h-5 flex-shrink-0"
                }, null, _parent2, _scopeId));
                _push2(``);
                if (unref(sidebarOpen)) {
                  _push2(`<span class="whitespace-nowrap" data-v-67c37feb${_scopeId}>${ssrInterpolate(item.label)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode(_component_Icon, {
                    name: item.icon,
                    class: "w-5 h-5 flex-shrink-0"
                  }, null, 8, ["name"]),
                  createVNode(Transition, { name: "fade" }, {
                    default: withCtx(() => [
                      unref(sidebarOpen) ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "whitespace-nowrap"
                      }, toDisplayString(item.label), 1)) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1024)
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></nav><div class="p-3 border-t border-dark-700" data-v-67c37feb><button class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors" data-v-67c37feb>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: unref(sidebarOpen) ? "lucide:panel-left-close" : "lucide:panel-left-open",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</button></div></aside><div class="${ssrRenderClass(["flex-1 flex flex-col transition-all duration-300", unref(sidebarOpen) ? "ml-64" : "ml-20"])}" data-v-67c37feb><header class="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700" data-v-67c37feb><div class="flex items-center gap-4" data-v-67c37feb><h1 class="text-lg font-semibold text-white" data-v-67c37feb>${ssrInterpolate(unref(pageTitle))}</h1></div><div class="flex items-center gap-3" data-v-67c37feb><button class="relative p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors" data-v-67c37feb>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:bell",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`<span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" data-v-67c37feb></span></button><div class="relative" data-v-67c37feb><button class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-dark-800 transition-colors" data-v-67c37feb><div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-semibold" data-v-67c37feb>${ssrInterpolate(unref(initials))}</div>`);
      if (unref(user)) {
        _push(`<span class="text-sm font-medium text-dark-200 hidden md:block" data-v-67c37feb>${ssrInterpolate(unref(user).fullName)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:chevron-down",
        class: "w-4 h-4 text-dark-400"
      }, null, _parent));
      _push(`</button>`);
      if (unref(userMenuOpen)) {
        _push(`<div class="absolute right-0 mt-2 w-56 bg-dark-850 border border-dark-700 rounded-xl shadow-xl py-2 z-50" data-v-67c37feb><div class="px-4 py-2 border-b border-dark-700" data-v-67c37feb><p class="text-sm font-medium text-dark-200" data-v-67c37feb>${ssrInterpolate((_a = unref(user)) == null ? void 0 : _a.fullName)}</p><p class="text-xs text-dark-400" data-v-67c37feb>${ssrInterpolate((_b = unref(user)) == null ? void 0 : _b.email)}</p><span class="badge-info mt-1" data-v-67c37feb>${ssrInterpolate((_c = unref(user)) == null ? void 0 : _c.role)}</span></div><button class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-dark-800 transition-colors" data-v-67c37feb>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:log-out",
          class: "w-4 h-4"
        }, null, _parent));
        _push(` Sign out </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header><main class="flex-1 overflow-y-auto p-6" data-v-67c37feb>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-67c37feb"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard-DhdPb9ye.mjs.map
