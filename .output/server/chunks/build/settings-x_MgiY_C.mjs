import { defineComponent, resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const ranks = [
      { name: "Starter", range: "\u20A60 \u2013 \u20A699,999" },
      { name: "Builder", range: "\u20A6100,000 \u2013 \u20A6499,999" },
      { name: "Silver", range: "\u20A6500,000 \u2013 \u20A6999,999" },
      { name: "Gold", range: "\u20A61,000,000 \u2013 \u20A62,999,999" },
      { name: "Platinum", range: "\u20A63,000,000 \u2013 \u20A64,999,999" },
      { name: "Diamond", range: "\u20A65,000,000+" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="mb-6"><h1 class="text-2xl font-bold text-white">Settings</h1><p class="text-dark-400 text-sm mt-1">Platform configuration</p></div><div class="max-w-2xl space-y-6"><div class="card"><h2 class="text-lg font-semibold text-white mb-4">Commission Rates</h2><div class="space-y-3"><div class="flex items-center justify-between py-2 border-b border-dark-700/50"><div><p class="text-sm font-medium text-white">Standard</p><p class="text-xs text-dark-400">Default merchant category</p></div><span class="text-sm text-primary-400 font-semibold">3%</span></div><div class="flex items-center justify-between py-2 border-b border-dark-700/50"><div><p class="text-sm font-medium text-white">Gold</p><p class="text-xs text-dark-400">\u20A61M+ total sales</p></div><span class="text-sm text-amber-400 font-semibold">5%</span></div><div class="flex items-center justify-between py-2"><div><p class="text-sm font-medium text-white">Premium</p><p class="text-xs text-dark-400">\u20A65M+ total sales</p></div><span class="text-sm text-purple-400 font-semibold">7.5%</span></div></div></div><div class="card"><h2 class="text-lg font-semibold text-white mb-4">Rank Thresholds (Monthly Sales)</h2><div class="space-y-2"><!--[-->`);
      ssrRenderList(ranks, (rank, i) => {
        _push(`<div class="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0"><span class="text-sm font-medium text-white capitalize">${ssrInterpolate(rank.name)}</span><span class="text-xs text-dark-400">${ssrInterpolate(rank.range)}</span></div>`);
      });
      _push(`<!--]--></div></div><div class="card"><h2 class="text-lg font-semibold text-white mb-4">Platform</h2><div class="space-y-3"><div class="flex items-center justify-between text-sm"><span class="text-dark-400">Min Withdrawal</span><span class="text-dark-200">\u20A610,000</span></div><div class="flex items-center justify-between text-sm"><span class="text-dark-400">Referral Cookie Duration</span><span class="text-dark-200">30 days</span></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-x_MgiY_C.mjs.map
