import { b as useToast, c as __nuxt_component_1 } from "../server.mjs";
import { _ as __nuxt_component_0 } from "./nuxt-link-j7LYAefj.js";
import { defineComponent, ref, computed, resolveComponent, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import "/Users/mac/Documents/wisekings/admin/node_modules/hookable/dist/index.mjs";
import { u as usePartnersApi } from "./usePartnersApi-LSGssh6C.js";
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
    usePartnersApi();
    useToast();
    const partners = ref([]);
    const loading = ref(true);
    const page = ref(1);
    const limit = ref(10);
    const total = ref(0);
    const search = ref("");
    const statusFilter = ref("");
    const totalPages = computed(() => Math.ceil(total.value / limit.value));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_Icon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"><div><h1 class="text-2xl font-bold text-white">Partners</h1><p class="text-dark-400 text-sm mt-1">Manage investor partnerships</p></div></div><div class="card mb-6"><div class="flex flex-wrap gap-3"><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Search partners..." class="input max-w-xs"><select class="input max-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>All Statuses</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "active") : ssrLooseEqual(unref(statusFilter), "active")) ? " selected" : ""}>Active</option><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "pending") : ssrLooseEqual(unref(statusFilter), "pending")) ? " selected" : ""}>Pending</option><option value="suspended"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "suspended") : ssrLooseEqual(unref(statusFilter), "suspended")) ? " selected" : ""}>Suspended</option></select></div></div><div class="table-container"><table class="data-table"><thead><tr><th>Company</th><th>Contact</th><th>Code</th><th>Commission</th><th>Sales</th><th>Status</th><th>Actions</th></tr></thead><tbody>`);
      if (unref(loading)) {
        _push(`<tr><td colspan="7" class="text-center py-12 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-6 h-6 animate-spin mx-auto"
        }, null, _parent));
        _push(`</td></tr>`);
      } else if (unref(partners).length === 0) {
        _push(`<tr><td colspan="7" class="text-center py-12 text-dark-400">No partners found</td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(partners), (p) => {
          _push(`<tr><td><p class="font-medium text-white">${ssrInterpolate(p.companyName)}</p><p class="text-xs text-dark-400">${ssrInterpolate(p.email)}</p></td><td class="text-dark-200">${ssrInterpolate(p.contactPerson)}</td><td><code class="text-xs bg-dark-800 px-2 py-0.5 rounded">${ssrInterpolate(p.partnerCode)}</code></td><td>${ssrInterpolate(p.commissionRate)}%</td><td>₦${ssrInterpolate((p.totalSalesValue || 0).toLocaleString())}</td><td><span class="${ssrRenderClass(p.status === "active" ? "badge-success" : p.status === "suspended" ? "badge-danger" : "badge-warning")}">${ssrInterpolate(p.status)}</span></td><td><div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/partners/${p._id}`,
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
          if (p.status === "pending") {
            _push(`<button class="btn-ghost btn-sm text-emerald-400">`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:check",
              class: "w-3.5 h-3.5"
            }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          if (p.status === "active") {
            _push(`<button class="btn-ghost btn-sm text-red-400">`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:ban",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partners/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-D-e1nnbx.js.map
