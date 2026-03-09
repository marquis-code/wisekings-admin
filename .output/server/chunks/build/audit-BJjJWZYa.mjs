import { b as useToast, c as __nuxt_component_1, a as useNuxtApp } from './server.mjs';
import { defineComponent, ref, computed, resolveComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

function useAuditApi() {
  const { $api } = useNuxtApp();
  return {
    findAll(params) {
      return $api("/audit", { params });
    }
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "audit",
  __ssrInlineRender: true,
  setup(__props) {
    useAuditApi();
    useToast();
    const logs = ref([]);
    const loading = ref(true);
    const page = ref(1);
    const total = ref(0);
    const totalPages = computed(() => Math.ceil(total.value / 20));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="mb-6"><h1 class="text-2xl font-bold text-white">Audit Trail</h1><p class="text-dark-400 text-sm mt-1">Track all system actions and changes</p></div><div class="table-container"><table class="data-table"><thead><tr><th>User</th><th>Action</th><th>Resource</th><th>IP</th><th>Timestamp</th></tr></thead><tbody>`);
      if (unref(loading)) {
        _push(`<tr><td colspan="5" class="text-center py-12 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-6 h-6 animate-spin mx-auto"
        }, null, _parent));
        _push(`</td></tr>`);
      } else if (unref(logs).length === 0) {
        _push(`<tr><td colspan="5" class="text-center py-12 text-dark-400">No audit logs</td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(logs), (l) => {
          var _a;
          _push(`<tr><td class="text-dark-200 text-sm">${ssrInterpolate(typeof l.userId === "object" ? (_a = l.userId) == null ? void 0 : _a.fullName : l.userId)}</td><td><span class="badge-info">${ssrInterpolate(l.action)}</span></td><td class="text-dark-300 text-sm">${ssrInterpolate(l.resource)}</td><td class="text-dark-400 text-xs font-mono">${ssrInterpolate(l.ipAddress || "\u2014")}</td><td class="text-dark-400 text-xs">${ssrInterpolate(new Date(l.timestamp).toLocaleString())}</td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div>`);
      if (unref(totalPages) > 1) {
        _push(`<div class="flex items-center justify-between mt-4"><p class="text-sm text-dark-400">Page ${ssrInterpolate(unref(page))} of ${ssrInterpolate(unref(totalPages))}</p><div class="flex gap-2"><button${ssrIncludeBooleanAttr(unref(page) <= 1) ? " disabled" : ""} class="btn-secondary btn-sm">Prev</button><button${ssrIncludeBooleanAttr(unref(page) >= unref(totalPages)) ? " disabled" : ""} class="btn-secondary btn-sm">Next</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/audit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=audit-BJjJWZYa.mjs.map
