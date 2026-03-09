import { c as __nuxt_component_1 } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-j7LYAefj.mjs';
import { defineComponent, ref, computed, resolveComponent, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useOrdersApi } from './useOrdersApi-CRRcXSQA.mjs';
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
    useOrdersApi();
    useMerchantsApi();
    const recentOrders = ref([]);
    const recentMerchants = ref([]);
    const orderStats = ref({});
    const merchantStats = ref({});
    const stats = computed(() => {
      var _a, _b, _c, _d, _e;
      return [
        {
          label: "Total Orders",
          value: ((_a = orderStats.value) == null ? void 0 : _a.total) || 0,
          subtitle: "All time",
          icon: "lucide:shopping-cart",
          bgColor: "bg-blue-500/10",
          iconColor: "text-blue-400"
        },
        {
          label: "Active Merchants",
          value: ((_b = merchantStats.value) == null ? void 0 : _b.active) || 0,
          subtitle: `${((_c = merchantStats.value) == null ? void 0 : _c.total) || 0} total`,
          icon: "lucide:store",
          bgColor: "bg-emerald-500/10",
          iconColor: "text-emerald-400"
        },
        {
          label: "Revenue",
          value: `\u20A6${((((_d = orderStats.value) == null ? void 0 : _d.totalRevenue) || 0) / 1e3).toFixed(0)}k`,
          subtitle: "Total sales",
          icon: "lucide:trending-up",
          bgColor: "bg-purple-500/10",
          iconColor: "text-purple-400"
        },
        {
          label: "Pending Withdrawals",
          value: ((_e = orderStats.value) == null ? void 0 : _e.pendingWithdrawals) || 0,
          subtitle: "Awaiting action",
          icon: "lucide:wallet",
          bgColor: "bg-amber-500/10",
          iconColor: "text-amber-400"
        }
      ];
    });
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
            _push2(`View all \u2192`);
          } else {
            return [
              createTextVNode("View all \u2192")
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
          _push(`<div class="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0"><div><p class="text-sm font-medium text-dark-200">${ssrInterpolate(order.orderNumber)}</p><p class="text-xs text-dark-400">\u20A6${ssrInterpolate(order.totalAmount.toLocaleString())}</p></div><span class="${ssrRenderClass(statusBadge(order.status))}">${ssrInterpolate(order.status)}</span></div>`);
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
            _push2(`View all \u2192`);
          } else {
            return [
              createTextVNode("View all \u2192")
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

export { _sfc_main as default };
//# sourceMappingURL=index-CaDbD2ec.mjs.map
