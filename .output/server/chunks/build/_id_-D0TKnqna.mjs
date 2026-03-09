import { _ as __nuxt_component_0 } from './nuxt-link-j7LYAefj.mjs';
import { e as useRoute, b as useToast, c as __nuxt_component_1 } from './server.mjs';
import { defineComponent, ref, resolveComponent, withCtx, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useOrdersApi();
    useToast();
    const order = ref(null);
    const loading = ref(true);
    const updating = ref(false);
    const selectedStatus = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="flex items-center gap-3 mb-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/orders",
        class: "btn-ghost btn-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:arrow-left",
              class: "w-4 h-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "lucide:arrow-left",
                class: "w-4 h-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-2xl font-bold text-white">Order Details</h1></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-20">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-8 h-8 animate-spin mx-auto text-dark-400"
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(order)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 space-y-6"><div class="card"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-white">Items</h2><code class="text-sm bg-dark-800 px-2 py-0.5 rounded">${ssrInterpolate(unref(order).orderNumber)}</code></div><div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(order).items, (item) => {
          _push(`<div class="flex items-center gap-4 py-3 border-b border-dark-700/50 last:border-0"><div class="w-12 h-12 rounded-lg bg-dark-800 overflow-hidden flex-shrink-0">`);
          if (item.image) {
            _push(`<img${ssrRenderAttr("src", item.image)} class="w-full h-full object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex-1"><p class="text-sm font-medium text-white">${ssrInterpolate(item.name)}</p><p class="text-xs text-dark-400">Qty: ${ssrInterpolate(item.quantity)}</p></div><p class="text-sm font-medium text-white">\u20A6${ssrInterpolate((item.price * item.quantity).toLocaleString())}</p></div>`);
        });
        _push(`<!--]--></div><div class="mt-4 pt-4 border-t border-dark-700 space-y-2"><div class="flex justify-between text-sm"><span class="text-dark-400">Subtotal</span><span class="text-dark-200">\u20A6${ssrInterpolate(unref(order).totalAmount.toLocaleString())}</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Shipping</span><span class="text-dark-200">\u20A6${ssrInterpolate((unref(order).shippingFee || 0).toLocaleString())}</span></div><div class="flex justify-between text-sm font-bold"><span class="text-white">Total</span><span class="text-white">\u20A6${ssrInterpolate((unref(order).totalAmount + (unref(order).shippingFee || 0)).toLocaleString())}</span></div></div></div>`);
        if (unref(order).shippingAddress) {
          _push(`<div class="card"><h2 class="text-lg font-semibold text-white mb-3">Shipping Address</h2><p class="text-sm text-dark-200">${ssrInterpolate(unref(order).shippingAddress.fullName)}</p><p class="text-sm text-dark-400">${ssrInterpolate(unref(order).shippingAddress.address)}, ${ssrInterpolate(unref(order).shippingAddress.city)}, ${ssrInterpolate(unref(order).shippingAddress.state)}</p><p class="text-sm text-dark-400">${ssrInterpolate(unref(order).shippingAddress.phone)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6"><div class="card"><h2 class="text-lg font-semibold text-white mb-3">Status</h2><select class="input mb-3"><!--[-->`);
        ssrRenderList(["pending", "confirmed", "processing", "shipped", "delivered", "completed", "cancelled"], (s) => {
          _push(`<option${ssrRenderAttr("value", s)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), s) : ssrLooseEqual(unref(selectedStatus), s)) ? " selected" : ""}>${ssrInterpolate(s)}</option>`);
        });
        _push(`<!--]--></select><button class="btn-primary w-full btn-sm"${ssrIncludeBooleanAttr(unref(updating)) ? " disabled" : ""}>${ssrInterpolate(unref(updating) ? "Updating..." : "Update Status")}</button></div><div class="card space-y-3"><div class="flex justify-between text-sm"><span class="text-dark-400">Payment</span><span class="${ssrRenderClass(unref(order).paymentStatus === "paid" ? "badge-success" : "badge-warning")}">${ssrInterpolate(unref(order).paymentStatus)}</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Provider</span><span class="text-dark-200 capitalize">${ssrInterpolate(unref(order).paymentProvider || "\u2014")}</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Referral</span><span class="text-dark-200">${ssrInterpolate(unref(order).referralCode || "\u2014")}</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Created</span><span class="text-dark-200">${ssrInterpolate(new Date(unref(order).createdAt).toLocaleString())}</span></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-D0TKnqna.mjs.map
