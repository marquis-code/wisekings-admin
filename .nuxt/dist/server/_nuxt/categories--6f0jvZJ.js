import { b as useToast, c as __nuxt_component_1 } from "../server.mjs";
import { defineComponent, ref, watch, resolveComponent, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import "/Users/mac/Documents/wisekings/admin/node_modules/hookable/dist/index.mjs";
import { u as useProductsApi } from "./useProductsApi-Cs-rGqR3.js";
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
  __name: "categories",
  __ssrInlineRender: true,
  setup(__props) {
    useProductsApi();
    useToast();
    const categories = ref([]);
    const showForm = ref(false);
    const saving = ref(false);
    const editingId = ref("");
    const form = ref({ name: "", slug: "", description: "", sortOrder: 0, isActive: true });
    watch(() => form.value.name, (n) => {
      if (!editingId.value) form.value.slug = n.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="flex items-center justify-between mb-6"><div><h1 class="text-2xl font-bold text-white">Categories</h1><p class="text-dark-400 text-sm mt-1">Manage product categories and settings</p></div><button class="btn-primary">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:plus",
        class: "w-4 h-4"
      }, null, _parent));
      _push(` Add Category</button></div>`);
      if (unref(showForm)) {
        _push(`<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div class="bg-dark-850 border border-dark-700 rounded-2xl p-6 w-full max-w-md animate-slide-up"><h2 class="text-lg font-semibold text-white mb-4">${ssrInterpolate(unref(editingId) ? "Edit" : "New")} Category</h2><form class="space-y-4"><div><label class="label">Name</label><input${ssrRenderAttr("value", unref(form).name)} class="input" required></div><div><label class="label">Slug</label><input${ssrRenderAttr("value", unref(form).slug)} class="input" required></div><div><label class="label">Description</label><textarea class="input min-h-[80px]">${ssrInterpolate(unref(form).description)}</textarea></div><div><label class="label">Sort Order</label><input${ssrRenderAttr("value", unref(form).sortOrder)} type="number" class="input"></div><div class="flex items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).isActive) ? ssrLooseContain(unref(form).isActive, null) : unref(form).isActive) ? " checked" : ""} type="checkbox" id="catActive" class="rounded bg-dark-800 border-dark-600 text-primary-600"><label for="catActive" class="text-sm text-dark-300">Active</label></div><div class="flex gap-3"><button type="submit" class="btn-primary flex-1"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? "Saving..." : "Save")}</button><button type="button" class="btn-secondary flex-1">Cancel</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
      ssrRenderList(unref(categories), (c) => {
        _push(`<div class="card-hover"><div class="flex items-center justify-between mb-2"><h3 class="font-semibold text-white">${ssrInterpolate(c.name)}</h3><span class="${ssrRenderClass(c.isActive ? "badge-success" : "badge-danger")}">${ssrInterpolate(c.isActive ? "Active" : "Inactive")}</span></div><p class="text-dark-400 text-sm mb-3">${ssrInterpolate(c.description || "No description")}</p><code class="text-xs bg-dark-800 px-2 py-0.5 rounded text-dark-300">${ssrInterpolate(c.slug)}</code><div class="flex gap-2 mt-4"><button class="btn-ghost btn-sm">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:edit",
          class: "w-3.5 h-3.5"
        }, null, _parent));
        _push(` Edit</button><button class="btn-ghost btn-sm text-red-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:trash-2",
          class: "w-3.5 h-3.5"
        }, null, _parent));
        _push(` Delete</button></div></div>`);
      });
      _push(`<!--]-->`);
      if (unref(categories).length === 0) {
        _push(`<div class="col-span-full text-center py-12 text-dark-400">No categories yet</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/categories.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=categories--6f0jvZJ.js.map
