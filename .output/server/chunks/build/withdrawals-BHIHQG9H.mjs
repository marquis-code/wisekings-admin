import { b as useToast, c as __nuxt_component_1, a as useNuxtApp } from './server.mjs';
import { defineComponent, ref, computed, resolveComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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

function useWalletsApi() {
  const { $api } = useNuxtApp();
  return {
    getWithdrawals(params) {
      return $api("/wallets/withdrawals", { params });
    },
    approveWithdrawal(id) {
      return $api(`/wallets/withdrawals/${id}/approve`, { method: "PATCH" });
    },
    rejectWithdrawal(id, reason) {
      return $api(`/wallets/withdrawals/${id}/reject`, { method: "PATCH", body: { reason } });
    },
    markAsPaid(id, reference) {
      return $api(`/wallets/withdrawals/${id}/pay`, { method: "PATCH", body: { reference } });
    }
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "withdrawals",
  __ssrInlineRender: true,
  setup(__props) {
    useWalletsApi();
    useToast();
    const items = ref([]);
    const loading = ref(true);
    const page = ref(1);
    const total = ref(0);
    const statusFilter = ref("");
    const totalPages = computed(() => Math.ceil(total.value / 10));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="mb-6"><h1 class="text-2xl font-bold text-white">Withdrawal Requests</h1><p class="text-dark-400 text-sm mt-1">Approve, reject, or process payouts</p></div><div class="card mb-6"><div class="flex flex-wrap gap-3"><select class="input max-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>All</option><!--[-->`);
      ssrRenderList(["pending", "approved", "processing", "paid", "rejected"], (s) => {
        _push(`<option${ssrRenderAttr("value", s)}${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), s) : ssrLooseEqual(unref(statusFilter), s)) ? " selected" : ""}>${ssrInterpolate(s)}</option>`);
      });
      _push(`<!--]--></select></div></div><div class="table-container"><table class="data-table"><thead><tr><th>Requested By</th><th>Amount</th><th>Bank</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>`);
      if (unref(loading)) {
        _push(`<tr><td colspan="6" class="text-center py-12 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-6 h-6 animate-spin mx-auto"
        }, null, _parent));
        _push(`</td></tr>`);
      } else if (unref(items).length === 0) {
        _push(`<tr><td colspan="6" class="text-center py-12 text-dark-400">No withdrawals found</td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(items), (w) => {
          var _a;
          _push(`<tr><td class="text-dark-200 text-sm">${ssrInterpolate(w.requestedBy)}</td><td class="font-medium text-white">\u20A6${ssrInterpolate(w.amount.toLocaleString())}</td><td class="text-dark-300 text-sm">${ssrInterpolate(((_a = w.bankDetails) == null ? void 0 : _a.bankName) || "\u2014")}</td><td><span class="${ssrRenderClass({ "badge-success": w.status === "paid", "badge-warning": w.status === "pending", "badge-info": w.status === "approved" || w.status === "processing", "badge-danger": w.status === "rejected" }[w.status] || "badge-neutral")}">${ssrInterpolate(w.status)}</span></td><td class="text-dark-400 text-xs">${ssrInterpolate(new Date(w.createdAt).toLocaleDateString())}</td><td><div class="flex gap-1">`);
          if (w.status === "pending") {
            _push(`<button class="btn-ghost btn-sm text-emerald-400" title="Approve">`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:check",
              class: "w-3.5 h-3.5"
            }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          if (w.status === "pending") {
            _push(`<button class="btn-ghost btn-sm text-red-400" title="Reject">`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:x",
              class: "w-3.5 h-3.5"
            }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          if (w.status === "approved") {
            _push(`<button class="btn-ghost btn-sm text-blue-400" title="Mark Paid">`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:banknote",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wallets/withdrawals.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=withdrawals-BHIHQG9H.mjs.map
