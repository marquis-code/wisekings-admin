import { b as useToast, c as __nuxt_component_1 } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-j7LYAefj.mjs';
import { defineComponent, ref, computed, resolveComponent, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useOrdersApi } from './useOrdersApi-CRRcXSQA.mjs';
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
    useOrdersApi();
    useToast();
    const orders = ref([]);
    const loading = ref(true);
    const page = ref(1);
    const limit = ref(10);
    const total = ref(0);
    const search = ref("");
    const statusFilter = ref("");
    const paymentFilter = ref("");
    const totalPages = computed(() => Math.ceil(total.value / limit.value));
    function statusBadge(s) {
      return { active: "badge-success", completed: "badge-success", delivered: "badge-success", processing: "badge-info", shipped: "badge-info", confirmed: "badge-info", pending: "badge-warning", cancelled: "badge-danger", refunded: "badge-danger" }[s] || "badge-neutral";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_Icon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"><div><h1 class="text-2xl font-bold text-white">Orders</h1><p class="text-dark-400 text-sm mt-1">Manage all platform orders</p></div></div><div class="card mb-6"><div class="flex flex-wrap gap-3"><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Search order number..." class="input max-w-xs"><select class="input max-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>All Statuses</option><!--[-->`);
      ssrRenderList(["pending", "confirmed", "processing", "shipped", "delivered", "completed", "cancelled"], (s) => {
        _push(`<option${ssrRenderAttr("value", s)}${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), s) : ssrLooseEqual(unref(statusFilter), s)) ? " selected" : ""}>${ssrInterpolate(s)}</option>`);
      });
      _push(`<!--]--></select><select class="input max-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(paymentFilter)) ? ssrLooseContain(unref(paymentFilter), "") : ssrLooseEqual(unref(paymentFilter), "")) ? " selected" : ""}>All Payments</option><!--[-->`);
      ssrRenderList(["pending", "paid", "failed", "refunded"], (s) => {
        _push(`<option${ssrRenderAttr("value", s)}${ssrIncludeBooleanAttr(Array.isArray(unref(paymentFilter)) ? ssrLooseContain(unref(paymentFilter), s) : ssrLooseEqual(unref(paymentFilter), s)) ? " selected" : ""}>${ssrInterpolate(s)}</option>`);
      });
      _push(`<!--]--></select></div></div><div class="table-container"><table class="data-table"><thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>`);
      if (unref(loading)) {
        _push(`<tr><td colspan="8" class="text-center py-12 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-6 h-6 animate-spin mx-auto"
        }, null, _parent));
        _push(`</td></tr>`);
      } else if (unref(orders).length === 0) {
        _push(`<tr><td colspan="8" class="text-center py-12 text-dark-400">No orders found</td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(orders), (o) => {
          var _a, _b;
          _push(`<tr><td><code class="text-xs bg-dark-800 px-2 py-0.5 rounded">${ssrInterpolate(o.orderNumber)}</code></td><td class="text-dark-200 text-sm">${ssrInterpolate(typeof o.customerId === "object" ? (_a = o.customerId) == null ? void 0 : _a.fullName : o.customerId)}</td><td>${ssrInterpolate(((_b = o.items) == null ? void 0 : _b.length) || 0)}</td><td class="font-medium text-white">\u20A6${ssrInterpolate(o.totalAmount.toLocaleString())}</td><td><span class="${ssrRenderClass(o.paymentStatus === "paid" ? "badge-success" : o.paymentStatus === "failed" ? "badge-danger" : "badge-warning")}">${ssrInterpolate(o.paymentStatus)}</span></td><td><span class="${ssrRenderClass(statusBadge(o.status))}">${ssrInterpolate(o.status)}</span></td><td class="text-dark-400 text-xs">${ssrInterpolate(new Date(o.createdAt).toLocaleDateString())}</td><td>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/orders/${o._id}`,
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
          _push(`</td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div>`);
      if (unref(totalPages) > 1) {
        _push(`<div class="flex items-center justify-between mt-4"><p class="text-sm text-dark-400">Page ${ssrInterpolate(unref(page))} of ${ssrInterpolate(unref(totalPages))}</p><div class="flex gap-2"><button${ssrIncludeBooleanAttr(unref(page) <= 1) ? " disabled" : ""} class="btn-secondary btn-sm">Previous</button><button${ssrIncludeBooleanAttr(unref(page) >= unref(totalPages)) ? " disabled" : ""} class="btn-secondary btn-sm">Next</button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BUNqKf2q.mjs.map
