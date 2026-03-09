import { _ as __nuxt_component_0 } from "./nuxt-link-j7LYAefj.js";
import { e as useRoute, b as useToast, c as __nuxt_component_1 } from "../server.mjs";
import { defineComponent, ref, resolveComponent, withCtx, createVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import "/Users/mac/Documents/wisekings/admin/node_modules/hookable/dist/index.mjs";
import { u as useMerchantsApi } from "./useMerchantsApi-C7mC4_63.js";
import "/Users/mac/Documents/wisekings/admin/node_modules/ufo/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/mac/Documents/wisekings/admin/node_modules/unctx/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/mac/Documents/wisekings/admin/node_modules/defu/dist/defu.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/destr/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/ohash/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/klona/dist/index.mjs";
import "@iconify/vue";
import "@iconify/utils/lib/css/icon";
import "/Users/mac/Documents/wisekings/admin/node_modules/@unhead/vue/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/perfect-debounce/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useMerchantsApi();
    useToast();
    const merchant = ref(null);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="flex items-center gap-3 mb-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/merchants",
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
      _push(`<h1 class="text-2xl font-bold text-white">Merchant Details</h1></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-20 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-8 h-8 animate-spin mx-auto"
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(merchant)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="card lg:col-span-1"><div class="text-center"><div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">${ssrInterpolate(unref(merchant).fullName?.[0] || "?")}</div><h2 class="text-xl font-bold text-white">${ssrInterpolate(unref(merchant).fullName)}</h2><p class="text-dark-400 text-sm">${ssrInterpolate(unref(merchant).email)}</p><code class="text-xs bg-dark-800 px-2 py-0.5 rounded mt-2 inline-block">${ssrInterpolate(unref(merchant).merchantCode)}</code><div class="mt-3"><span class="${ssrRenderClass(unref(merchant).status === "active" ? "badge-success" : unref(merchant).status === "suspended" ? "badge-danger" : "badge-warning")}">${ssrInterpolate(unref(merchant).status)}</span></div></div><div class="mt-6 space-y-3 border-t border-dark-700 pt-4"><div class="flex justify-between text-sm"><span class="text-dark-400">Phone</span><span class="text-dark-200">${ssrInterpolate(unref(merchant).phone || "—")}</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Category</span><span class="badge-info capitalize">${ssrInterpolate(unref(merchant).category)}</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Rank</span><span class="badge-neutral capitalize">${ssrInterpolate(unref(merchant).rank)}</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Commission</span><span class="text-dark-200">${ssrInterpolate(unref(merchant).commissionRate)}%</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Joined</span><span class="text-dark-200">${ssrInterpolate(new Date(unref(merchant).createdAt).toLocaleDateString())}</span></div></div><div class="mt-6 flex gap-2">`);
        if (unref(merchant).status === "active") {
          _push(`<button class="btn-danger btn-sm flex-1">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "lucide:ban",
            class: "w-4 h-4"
          }, null, _parent));
          _push(` Suspend </button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(merchant).status === "suspended") {
          _push(`<button class="btn-primary btn-sm flex-1">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "lucide:check-circle",
            class: "w-4 h-4"
          }, null, _parent));
          _push(` Activate </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="lg:col-span-2 space-y-6"><div class="grid grid-cols-2 md:grid-cols-3 gap-4"><div class="stat-card"><span class="text-dark-400 text-sm">Total Sales</span><p class="text-xl font-bold text-white">₦${ssrInterpolate((unref(merchant).totalSalesValue || 0).toLocaleString())}</p></div><div class="stat-card"><span class="text-dark-400 text-sm">Monthly Sales</span><p class="text-xl font-bold text-white">₦${ssrInterpolate((unref(merchant).monthlySalesValue || 0).toLocaleString())}</p></div><div class="stat-card"><span class="text-dark-400 text-sm">Orders Referred</span><p class="text-xl font-bold text-white">${ssrInterpolate(unref(merchant).totalOrdersReferred || 0)}</p></div></div><div class="card"><h3 class="text-lg font-semibold text-white mb-3">Referral Link</h3><div class="flex items-center gap-2"><input${ssrRenderAttr("value", unref(merchant).referralLink)} readonly class="input flex-1"><button class="btn-secondary btn-sm">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:copy",
          class: "w-4 h-4"
        }, null, _parent));
        _push(`</button></div></div>`);
        if (unref(merchant).bankAccountDetails) {
          _push(`<div class="card"><h3 class="text-lg font-semibold text-white mb-3">Bank Details</h3><div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-dark-400">Bank</span><span class="text-dark-200">${ssrInterpolate(unref(merchant).bankAccountDetails.bankName)}</span></div><div class="flex justify-between"><span class="text-dark-400">Account Name</span><span class="text-dark-200">${ssrInterpolate(unref(merchant).bankAccountDetails.accountName)}</span></div><div class="flex justify-between"><span class="text-dark-400">Account Number</span><span class="text-dark-200">${ssrInterpolate(unref(merchant).bankAccountDetails.accountNumber)}</span></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/merchants/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-DSDvAXd4.js.map
