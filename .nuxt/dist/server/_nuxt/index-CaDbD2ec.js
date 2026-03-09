import { c as __nuxt_component_1 } from "../server.mjs";
import { _ as __nuxt_component_0 } from "./nuxt-link-j7LYAefj.js";
import { defineComponent, ref, computed, resolveComponent, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import "/Users/mac/Documents/wisekings/admin/node_modules/hookable/dist/index.mjs";
import { u as useOrdersApi } from "./useOrdersApi-CRRcXSQA.js";
import { u as useMerchantsApi } from "./useMerchantsApi-C7mC4_63.js";
import "/Users/mac/Documents/wisekings/admin/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/mac/Documents/wisekings/admin/node_modules/unctx/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/mac/Documents/wisekings/admin/node_modules/defu/dist/defu.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/ufo/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/destr/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/ohash/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/klona/dist/index.mjs";
import "@iconify/vue";
import "@iconify/utils/lib/css/icon";
import "/Users/mac/Documents/wisekings/admin/node_modules/@unhead/vue/dist/index.mjs";
import "/Users/mac/Documents/wisekings/admin/node_modules/perfect-debounce/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useOrdersApi();
    useMerchantsApi();
    const recentOrders = ref([]);
    const recentMerchants = ref([]);
    const orderStats = ref({});
    const merchantStats = ref({});
    const stats = computed(() => [
      {
        label: "Total Orders",
        value: orderStats.value?.total || 0,
        subtitle: "All time",
        icon: "lucide:shopping-cart",
        bgColor: "bg-blue-500/10",
        iconColor: "text-blue-400"
      },
      {
        label: "Active Merchants",
        value: merchantStats.value?.active || 0,
        subtitle: `${merchantStats.value?.total || 0} total`,
        icon: "lucide:store",
        bgColor: "bg-emerald-500/10",
        iconColor: "text-emerald-400"
      },
      {
        label: "Revenue",
        value: `₦${((orderStats.value?.totalRevenue || 0) / 1e3).toFixed(0)}k`,
        subtitle: "Total sales",
        icon: "lucide:trending-up",
        bgColor: "bg-purple-500/10",
        iconColor: "text-purple-400"
      },
      {
        label: "Pending Withdrawals",
        value: orderStats.value?.pendingWithdrawals || 0,
        subtitle: "Awaiting action",
        icon: "lucide:wallet",
        bgColor: "bg-amber-500/10",
        iconColor: "text-amber-400"
      }
    ]);
    function statusBadge(status) {
      const map = {
        active: "badge-success",
        pending: "badge-warning",
        suspended: "badge-danger",
        completed: "badge-success",
        delivered: "badge-success",
        processing: "badge-info",
        shipped: "badge-info",
        cancelled: "badge-danger"
      };
      return map[status] || "badge-neutral";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_Icon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="stat-card"><div class="flex items-center justify-between"><span class="text-dark-400 text-sm">${ssrInterpolate(stat.label)}</span><div class="${ssrRenderClass(["w-10 h-10 rounded-lg flex items-center justify-center", stat.bgColor])}">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: stat.icon,
          class: ["w-5 h-5", stat.iconColor]
        }, null, _parent));
        _push(`</div></div><p class="text-2xl font-bold text-white">${ssrInterpolate(stat.value)}</p><p class="text-xs text-dark-400">${ssrInterpolate(stat.subtitle)}</p></div>`);
      });
      _push(`<!--]--></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="card"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-white">Recent Orders</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/orders",
        class: "text-primary-400 text-sm hover:text-primary-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`View all →`);
          } else {
            return [
              createTextVNode("View all →")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(recentOrders).length === 0) {
        _push(`<div class="text-center py-8 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:package",
          class: "w-8 h-8 mx-auto mb-2 opacity-50"
        }, null, _parent));
        _push(`<p>No orders yet</p></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(recentOrders), (order) => {
          _push(`<div class="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0"><div><p class="text-sm font-medium text-dark-200">${ssrInterpolate(order.orderNumber)}</p><p class="text-xs text-dark-400">₦${ssrInterpolate(order.totalAmount.toLocaleString())}</p></div><span class="${ssrRenderClass(statusBadge(order.status))}">${ssrInterpolate(order.status)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div class="card"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-white">Recent Merchants</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/merchants",
        class: "text-primary-400 text-sm hover:text-primary-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`View all →`);
          } else {
            return [
              createTextVNode("View all →")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(recentMerchants).length === 0) {
        _push(`<div class="text-center py-8 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:store",
          class: "w-8 h-8 mx-auto mb-2 opacity-50"
        }, null, _parent));
        _push(`<p>No merchants yet</p></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(recentMerchants), (merchant) => {
          _push(`<div class="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0"><div><p class="text-sm font-medium text-dark-200">${ssrInterpolate(merchant.fullName)}</p><p class="text-xs text-dark-400">${ssrInterpolate(merchant.merchantCode)}</p></div><span class="${ssrRenderClass(statusBadge(merchant.status))}">${ssrInterpolate(merchant.status)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CaDbD2ec.js.map
