import { _ as __nuxt_component_0 } from "./nuxt-link-j7LYAefj.js";
import { e as useRoute, b as useToast, c as __nuxt_component_1 } from "../server.mjs";
import { defineComponent, ref, resolveComponent, withCtx, createVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import "/Users/mac/Documents/wisekings/admin/node_modules/hookable/dist/index.mjs";
import { u as usePartnersApi } from "./usePartnersApi-LSGssh6C.js";
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
    usePartnersApi();
    useToast();
    const partner = ref(null);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="flex items-center gap-3 mb-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/partners",
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
      _push(`<h1 class="text-2xl font-bold text-white">Partner Details</h1></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-20">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-8 h-8 animate-spin mx-auto text-dark-400"
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(partner)) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="card"><div class="text-center"><div class="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">${ssrInterpolate(unref(partner).companyName?.[0] || "?")}</div><h2 class="text-xl font-bold text-white">${ssrInterpolate(unref(partner).companyName)}</h2><p class="text-dark-400 text-sm">${ssrInterpolate(unref(partner).contactPerson)}</p><code class="text-xs bg-dark-800 px-2 py-0.5 rounded mt-2 inline-block">${ssrInterpolate(unref(partner).partnerCode)}</code><div class="mt-3"><span class="${ssrRenderClass(unref(partner).status === "active" ? "badge-success" : unref(partner).status === "suspended" ? "badge-danger" : "badge-warning")}">${ssrInterpolate(unref(partner).status)}</span></div></div><div class="mt-6 space-y-3 border-t border-dark-700 pt-4"><div class="flex justify-between text-sm"><span class="text-dark-400">Email</span><span class="text-dark-200">${ssrInterpolate(unref(partner).email)}</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Phone</span><span class="text-dark-200">${ssrInterpolate(unref(partner).phone || "—")}</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Commission</span><span class="text-dark-200">${ssrInterpolate(unref(partner).commissionRate)}%</span></div><div class="flex justify-between text-sm"><span class="text-dark-400">Joined</span><span class="text-dark-200">${ssrInterpolate(new Date(unref(partner).createdAt).toLocaleDateString())}</span></div></div><div class="mt-6 flex gap-2">`);
        if (unref(partner).status === "pending") {
          _push(`<button class="btn-primary btn-sm flex-1">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "lucide:check",
            class: "w-4 h-4"
          }, null, _parent));
          _push(` Approve</button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(partner).status === "active") {
          _push(`<button class="btn-danger btn-sm flex-1">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "lucide:ban",
            class: "w-4 h-4"
          }, null, _parent));
          _push(` Suspend</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="lg:col-span-2 space-y-6"><div class="grid grid-cols-2 gap-4"><div class="stat-card"><span class="text-dark-400 text-sm">Total Sales</span><p class="text-xl font-bold text-white">₦${ssrInterpolate((unref(partner).totalSalesValue || 0).toLocaleString())}</p></div><div class="stat-card"><span class="text-dark-400 text-sm">Orders Referred</span><p class="text-xl font-bold text-white">${ssrInterpolate(unref(partner).totalOrdersReferred || 0)}</p></div></div><div class="card"><h3 class="text-lg font-semibold text-white mb-3">Referral Link</h3><div class="flex items-center gap-2"><input${ssrRenderAttr("value", unref(partner).referralLink)} readonly class="input flex-1"><button class="btn-secondary btn-sm">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:copy",
          class: "w-4 h-4"
        }, null, _parent));
        _push(`</button></div></div>`);
        if (unref(partner).bankAccountDetails) {
          _push(`<div class="card"><h3 class="text-lg font-semibold text-white mb-3">Bank Details</h3><div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-dark-400">Bank</span><span class="text-dark-200">${ssrInterpolate(unref(partner).bankAccountDetails.bankName)}</span></div><div class="flex justify-between"><span class="text-dark-400">Account</span><span class="text-dark-200">${ssrInterpolate(unref(partner).bankAccountDetails.accountNumber)}</span></div><div class="flex justify-between"><span class="text-dark-400">Name</span><span class="text-dark-200">${ssrInterpolate(unref(partner).bankAccountDetails.accountName)}</span></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partners/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-BsL9aGYh.js.map
