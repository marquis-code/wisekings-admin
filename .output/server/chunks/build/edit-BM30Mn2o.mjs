import { _ as __nuxt_component_0 } from './nuxt-link-j7LYAefj.mjs';
import { e as useRoute, b as useToast, c as __nuxt_component_1 } from './server.mjs';
import { defineComponent, computed, ref, watch, resolveComponent, withCtx, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { u as useProductsApi } from './useProductsApi-Cs-rGqR3.mjs';
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
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useProductsApi();
    useToast();
    const isEdit = computed(() => route.params.id && route.params.id !== "new");
    const categories = ref([]);
    const saving = ref(false);
    const tagsInput = ref("");
    const form = ref({
      name: "",
      description: "",
      price: 0,
      compareAtPrice: 0,
      stock: 0,
      sku: "",
      slug: "",
      category: "",
      isActive: true,
      tags: []
    });
    watch(() => form.value.name, (n) => {
      if (!isEdit.value) form.value.slug = n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="flex items-center gap-3 mb-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/products",
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
      _push(`<h1 class="text-2xl font-bold text-white">${ssrInterpolate(unref(isEdit) ? "Edit Product" : "New Product")}</h1></div><form class="max-w-3xl space-y-6"><div class="card space-y-4"><h2 class="text-lg font-semibold text-white">Basic Info</h2><div><label class="label">Name</label><input${ssrRenderAttr("value", unref(form).name)} type="text" class="input" required></div><div><label class="label">Description</label><textarea class="input min-h-[100px]" required>${ssrInterpolate(unref(form).description)}</textarea></div><div class="grid grid-cols-2 gap-4"><div><label class="label">Price (\u20A6)</label><input${ssrRenderAttr("value", unref(form).price)} type="number" min="0" class="input" required></div><div><label class="label">Compare At Price</label><input${ssrRenderAttr("value", unref(form).compareAtPrice)} type="number" min="0" class="input"></div></div><div class="grid grid-cols-2 gap-4"><div><label class="label">Stock</label><input${ssrRenderAttr("value", unref(form).stock)} type="number" min="0" class="input" required></div><div><label class="label">SKU</label><input${ssrRenderAttr("value", unref(form).sku)} type="text" class="input"></div></div><div><label class="label">Category</label><select class="input"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, "") : ssrLooseEqual(unref(form).category, "")) ? " selected" : ""}>Select category</option><!--[-->`);
      ssrRenderList(unref(categories), (c) => {
        _push(`<option${ssrRenderAttr("value", c._id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).category) ? ssrLooseContain(unref(form).category, c._id) : ssrLooseEqual(unref(form).category, c._id)) ? " selected" : ""}>${ssrInterpolate(c.name)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="label">Slug</label><input${ssrRenderAttr("value", unref(form).slug)} type="text" class="input" required></div><div><label class="label">Tags (comma-separated)</label><input${ssrRenderAttr("value", unref(tagsInput))} type="text" class="input" placeholder="snack, healthy, popular"></div><div class="flex items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).isActive) ? ssrLooseContain(unref(form).isActive, null) : unref(form).isActive) ? " checked" : ""} type="checkbox" id="isActive" class="rounded bg-dark-800 border-dark-600 text-primary-600"><label for="isActive" class="text-sm text-dark-300">Active</label></div></div><div class="flex gap-3"><button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>`);
      if (unref(saving)) {
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-4 h-4 animate-spin"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(saving) ? "Saving..." : unref(isEdit) ? "Update Product" : "Create Product")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/products",
        class: "btn-secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Cancel`);
          } else {
            return [
              createTextVNode("Cancel")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-BM30Mn2o.mjs.map
