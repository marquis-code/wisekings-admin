import { defineComponent, ref, resolveComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { b as useToast, a as useNuxtApp } from './server.mjs';
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

function useNotificationsApi() {
  const { $api } = useNuxtApp();
  return {
    findAll(params) {
      return $api("/notifications", { params });
    },
    markAsRead(id) {
      return $api(`/notifications/${id}/read`, { method: "PATCH" });
    },
    markAllAsRead() {
      return $api("/notifications/read-all", { method: "PATCH" });
    },
    getUnreadCount() {
      return $api("/notifications/unread-count");
    }
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "notifications",
  __ssrInlineRender: true,
  setup(__props) {
    useNotificationsApi();
    useToast();
    const notifications = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="mb-6"><h1 class="text-2xl font-bold text-white">Notifications</h1></div><div class="space-y-3 max-w-2xl">`);
      if (unref(notifications).length === 0) {
        _push(`<div class="text-center py-12 text-dark-400">No notifications</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(notifications), (n) => {
        _push(`<div class="${ssrRenderClass(["card-hover cursor-pointer", n.isRead ? "opacity-60" : ""])}"><div class="flex items-start gap-3"><div class="${ssrRenderClass(["w-2 h-2 rounded-full mt-2 flex-shrink-0", n.isRead ? "bg-dark-600" : "bg-primary-500"])}"></div><div><p class="text-sm font-medium text-white">${ssrInterpolate(n.title)}</p><p class="text-sm text-dark-400 mt-0.5">${ssrInterpolate(n.message)}</p><p class="text-xs text-dark-500 mt-1">${ssrInterpolate(new Date(n.createdAt).toLocaleString())}</p></div></div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/notifications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=notifications-BIN32j7U.mjs.map
