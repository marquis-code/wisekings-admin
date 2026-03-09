import { _ as __nuxt_component_0 } from "./nuxt-link-j7LYAefj.js";
import { b as useToast, c as __nuxt_component_1 } from "../server.mjs";
import { defineComponent, ref, computed, resolveComponent, withCtx, createVNode, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import "/Users/mac/Documents/wisekings/admin/node_modules/hookable/dist/index.mjs";
import { u as useProductsApi } from "./useProductsApi-Cs-rGqR3.js";
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useProductsApi();
    useToast();
    const products = ref([]);
    const categories = ref([]);
    const loading = ref(true);
    const page = ref(1);
    const limit = ref(10);
    const total = ref(0);
    const search = ref("");
    const categoryFilter = ref("");
    const totalPages = computed(() => Math.ceil(total.value / limit.value));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"><div><h1 class="text-2xl font-bold text-white">Products</h1><p class="text-dark-400 text-sm mt-1">Manage product catalog</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/products/new",
        class: "btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:plus",
              class: "w-4 h-4"
            }, null, _parent2, _scopeId));
            _push2(` Add Product`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "lucide:plus",
                class: "w-4 h-4"
              }),
              createTextVNode(" Add Product")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="card mb-6"><div class="flex flex-wrap gap-3"><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Search products..." class="input max-w-xs"><select class="input max-w-[180px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(categoryFilter)) ? ssrLooseContain(unref(categoryFilter), "") : ssrLooseEqual(unref(categoryFilter), "")) ? " selected" : ""}>All Categories</option><!--[-->`);
      ssrRenderList(unref(categories), (c) => {
        _push(`<option${ssrRenderAttr("value", c._id)}${ssrIncludeBooleanAttr(Array.isArray(unref(categoryFilter)) ? ssrLooseContain(unref(categoryFilter), c._id) : ssrLooseEqual(unref(categoryFilter), c._id)) ? " selected" : ""}>${ssrInterpolate(c.name)}</option>`);
      });
      _push(`<!--]--></select></div></div><div class="table-container"><table class="data-table"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Category</th><th>Sold</th><th>Status</th><th>Actions</th></tr></thead><tbody>`);
      if (unref(loading)) {
        _push(`<tr><td colspan="7" class="text-center py-12 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-6 h-6 animate-spin mx-auto"
        }, null, _parent));
        _push(`</td></tr>`);
      } else if (unref(products).length === 0) {
        _push(`<tr><td colspan="7" class="text-center py-12 text-dark-400">No products found</td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(products), (p) => {
          _push(`<tr><td><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg bg-dark-800 overflow-hidden flex-shrink-0">`);
          if (p.images?.[0]) {
            _push(`<img${ssrRenderAttr("src", p.images[0])} class="w-full h-full object-cover">`);
          } else {
            _push(`<div class="w-full h-full flex items-center justify-center">`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:image",
              class: "w-5 h-5 text-dark-500"
            }, null, _parent));
            _push(`</div>`);
          }
          _push(`</div><div><p class="font-medium text-white text-sm">${ssrInterpolate(p.name)}</p><p class="text-xs text-dark-400">${ssrInterpolate(p.slug)}</p></div></div></td><td>₦${ssrInterpolate(p.price.toLocaleString())}</td><td><span class="${ssrRenderClass(p.stock > 10 ? "text-emerald-400" : p.stock > 0 ? "text-amber-400" : "text-red-400")}">${ssrInterpolate(p.stock)}</span></td><td class="text-dark-300">${ssrInterpolate(typeof p.category === "object" ? p.category?.name : "—")}</td><td>${ssrInterpolate(p.totalSold)}</td><td><span class="${ssrRenderClass(p.isActive ? "badge-success" : "badge-danger")}">${ssrInterpolate(p.isActive ? "Active" : "Inactive")}</span></td><td><div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/products/${p._id}/edit`,
            class: "btn-ghost btn-sm"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_Icon, {
                  name: "lucide:edit",
                  class: "w-3.5 h-3.5"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_Icon, {
                    name: "lucide:edit",
                    class: "w-3.5 h-3.5"
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button class="btn-ghost btn-sm text-red-400">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "lucide:trash-2",
            class: "w-3.5 h-3.5"
          }, null, _parent));
          _push(`</button></div></td></tr>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DBlEr9z-.js.map
