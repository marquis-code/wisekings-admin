import { b as useToast, c as __nuxt_component_1, a as useNuxtApp } from './server.mjs';
import { defineComponent, ref, resolveComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrLooseContain } from 'vue/server-renderer';
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

function useRolesApi() {
  const { $api } = useNuxtApp();
  return {
    findAll() {
      return $api("/roles");
    },
    findByName(name) {
      return $api(`/roles/${name}`);
    },
    getPermissions() {
      return $api("/roles/permissions");
    },
    create(data) {
      return $api("/roles", { method: "POST", body: data });
    },
    update(id, data) {
      return $api(`/roles/${id}`, { method: "PUT", body: data });
    },
    delete(id) {
      return $api(`/roles/${id}`, { method: "DELETE" });
    }
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "roles",
  __ssrInlineRender: true,
  setup(__props) {
    useRolesApi();
    useToast();
    const roles = ref([]);
    const availablePermissions = ref([]);
    const showForm = ref(false);
    const saving = ref(false);
    const editingId = ref("");
    const form = ref({ name: "", description: "", permissions: [] });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="flex items-center justify-between mb-6"><div><h1 class="text-2xl font-bold text-white">Roles &amp; Permissions</h1><p class="text-dark-400 text-sm mt-1">Configure staff access control</p></div><button class="btn-primary">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:plus",
        class: "w-4 h-4"
      }, null, _parent));
      _push(` Add Role</button></div>`);
      if (unref(showForm)) {
        _push(`<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div class="bg-dark-850 border border-dark-700 rounded-2xl p-6 w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto"><h2 class="text-lg font-semibold text-white mb-4">${ssrInterpolate(unref(editingId) ? "Edit" : "New")} Role</h2><form class="space-y-4"><div><label class="label">Name</label><input${ssrRenderAttr("value", unref(form).name)} class="input" required${ssrIncludeBooleanAttr(!!unref(editingId)) ? " disabled" : ""}></div><div><label class="label">Description</label><textarea class="input min-h-[60px]">${ssrInterpolate(unref(form).description)}</textarea></div><div><label class="label mb-2">Permissions</label><div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto bg-dark-900 rounded-lg p-3"><!--[-->`);
        ssrRenderList(unref(availablePermissions), (p) => {
          _push(`<label class="flex items-center gap-2 text-sm text-dark-300 hover:text-dark-200"><input type="checkbox"${ssrRenderAttr("value", p)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).permissions) ? ssrLooseContain(unref(form).permissions, p) : unref(form).permissions) ? " checked" : ""} class="rounded bg-dark-800 border-dark-600 text-primary-600"> ${ssrInterpolate(p)}</label>`);
        });
        _push(`<!--]--></div></div><div class="flex gap-3"><button type="submit" class="btn-primary flex-1"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? "Saving..." : "Save")}</button><button type="button" class="btn-secondary flex-1">Cancel</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
      ssrRenderList(unref(roles), (r) => {
        _push(`<div class="card-hover"><div class="flex items-center justify-between mb-2"><h3 class="font-semibold text-white capitalize">${ssrInterpolate(r.name)}</h3>`);
        if (r.isSystem) {
          _push(`<span class="badge-info">System</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><p class="text-dark-400 text-sm mb-3">${ssrInterpolate(r.description || "No description")}</p><div class="flex flex-wrap gap-1 mb-4"><!--[-->`);
        ssrRenderList(r.permissions.slice(0, 5), (p) => {
          _push(`<span class="badge-neutral text-[10px]">${ssrInterpolate(p)}</span>`);
        });
        _push(`<!--]-->`);
        if (r.permissions.length > 5) {
          _push(`<span class="badge-neutral text-[10px]">+${ssrInterpolate(r.permissions.length - 5)} more</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex gap-2"><button class="btn-ghost btn-sm">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:edit",
          class: "w-3.5 h-3.5"
        }, null, _parent));
        _push(` Edit</button>`);
        if (!r.isSystem) {
          _push(`<button class="btn-ghost btn-sm text-red-400">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "lucide:trash-2",
            class: "w-3.5 h-3.5"
          }, null, _parent));
          _push(` Delete</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/roles.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=roles-Dhy4ogBb.mjs.map
