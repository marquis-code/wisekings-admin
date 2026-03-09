import { b as useToast, c as __nuxt_component_1 } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-j7LYAefj.mjs';
import { defineComponent, ref, computed, resolveComponent, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useMerchantsApi } from './useMerchantsApi-C7mC4_63.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useMerchantsApi();
    useToast();
    const merchants = ref([]);
    const loading = ref(true);
    const page = ref(1);
    const limit = ref(10);
    const total = ref(0);
    const search = ref("");
    const statusFilter = ref("");
    const categoryFilter = ref("");
    const totalPages = computed(() => Math.ceil(total.value / limit.value));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_Icon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"><div><h1 class="text-2xl font-bold text-white">Merchants</h1><p class="text-dark-400 text-sm mt-1">Manage all merchants on the platform</p></div></div><div class="card mb-6"><div class="flex flex-wrap gap-3"><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Search merchants..." class="input max-w-xs"><select class="input max-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>All Statuses</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "active") : ssrLooseEqual(unref(statusFilter), "active")) ? " selected" : ""}>Active</option><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "pending") : ssrLooseEqual(unref(statusFilter), "pending")) ? " selected" : ""}>Pending</option><option value="suspended"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "suspended") : ssrLooseEqual(unref(statusFilter), "suspended")) ? " selected" : ""}>Suspended</option></select><select class="input max-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(categoryFilter)) ? ssrLooseContain(unref(categoryFilter), "") : ssrLooseEqual(unref(categoryFilter), "")) ? " selected" : ""}>All Categories</option><option value="standard"${ssrIncludeBooleanAttr(Array.isArray(unref(categoryFilter)) ? ssrLooseContain(unref(categoryFilter), "standard") : ssrLooseEqual(unref(categoryFilter), "standard")) ? " selected" : ""}>Standard</option><option value="gold"${ssrIncludeBooleanAttr(Array.isArray(unref(categoryFilter)) ? ssrLooseContain(unref(categoryFilter), "gold") : ssrLooseEqual(unref(categoryFilter), "gold")) ? " selected" : ""}>Gold</option><option value="premium"${ssrIncludeBooleanAttr(Array.isArray(unref(categoryFilter)) ? ssrLooseContain(unref(categoryFilter), "premium") : ssrLooseEqual(unref(categoryFilter), "premium")) ? " selected" : ""}>Premium</option></select></div></div><div class="table-container"><table class="data-table"><thead><tr><th>Merchant</th><th>Code</th><th>Category</th><th>Rank</th><th>Commission</th><th>Sales</th><th>Status</th><th>Actions</th></tr></thead><tbody>`);
      if (unref(loading)) {
        _push(`<tr><td colspan="8" class="text-center py-12 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-6 h-6 animate-spin mx-auto mb-2"
        }, null, _parent));
        _push(` Loading merchants... </td></tr>`);
      } else if (unref(merchants).length === 0) {
        _push(`<tr><td colspan="8" class="text-center py-12 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:store",
          class: "w-8 h-8 mx-auto mb-2 opacity-50"
        }, null, _parent));
        _push(` No merchants found </td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(merchants), (m) => {
          _push(`<tr><td><div><p class="font-medium text-white">${ssrInterpolate(m.fullName)}</p><p class="text-xs text-dark-400">${ssrInterpolate(m.email)}</p></div></td><td><code class="text-xs bg-dark-800 px-2 py-0.5 rounded">${ssrInterpolate(m.merchantCode)}</code></td><td><span class="badge-info capitalize">${ssrInterpolate(m.category)}</span></td><td><span class="badge-neutral capitalize">${ssrInterpolate(m.rank)}</span></td><td>${ssrInterpolate(m.commissionRate)}%</td><td>\u20A6${ssrInterpolate((m.totalSalesValue || 0).toLocaleString())}</td><td><span class="${ssrRenderClass(m.status === "active" ? "badge-success" : m.status === "suspended" ? "badge-danger" : "badge-warning")}">${ssrInterpolate(m.status)}</span></td><td><div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/merchants/${m._id}`,
            class: "btn-ghost btn-sm"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "lucide:eye",
                  class: "w-3.5 h-3.5"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_Icon, {
                    name: "lucide:eye",
                    class: "w-3.5 h-3.5"
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
          if (m.status === "active") {
            _push(`<button class="btn-ghost btn-sm text-red-400">`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:ban",
              class: "w-3.5 h-3.5"
            }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          if (m.status === "suspended") {
            _push(`<button class="btn-ghost btn-sm text-emerald-400">`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:check-circle",
              class: "w-3.5 h-3.5"
            }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div>`);
      if (unref(totalPages) > 1) {
        _push(`<div class="flex items-center justify-between mt-4"><p class="text-sm text-dark-400">Page ${ssrInterpolate(unref(page))} of ${ssrInterpolate(unref(totalPages))} (${ssrInterpolate(unref(total))} total)</p><div class="flex gap-2"><button${ssrIncludeBooleanAttr(unref(page) <= 1) ? " disabled" : ""} class="btn-secondary btn-sm">Previous</button><button${ssrIncludeBooleanAttr(unref(page) >= unref(totalPages)) ? " disabled" : ""} class="btn-secondary btn-sm">Next</button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/merchants/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-VPuQBWeZ.mjs.map
