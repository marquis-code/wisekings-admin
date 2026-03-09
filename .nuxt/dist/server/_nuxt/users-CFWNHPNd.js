import { a as useNuxtApp, b as useToast, c as __nuxt_component_1 } from "../server.mjs";
import { defineComponent, ref, computed, resolveComponent, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import "/Users/mac/Documents/wisekings/admin/node_modules/hookable/dist/index.mjs";
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
function useUsersApi() {
  const { $api } = useNuxtApp();
  return {
    findAll(params) {
      return $api("/users", { params });
    },
    findById(id) {
      return $api(`/users/${id}`);
    },
    update(id, data) {
      return $api(`/users/${id}`, { method: "PUT", body: data });
    },
    deactivate(id) {
      return $api(`/users/${id}/deactivate`, { method: "PATCH" });
    },
    activate(id) {
      return $api(`/users/${id}/activate`, { method: "PATCH" });
    }
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "users",
  __ssrInlineRender: true,
  setup(__props) {
    useUsersApi();
    useToast();
    const users = ref([]);
    const loading = ref(true);
    const page = ref(1);
    const total = ref(0);
    const search = ref("");
    const roleFilter = ref("");
    const totalPages = computed(() => Math.ceil(total.value / 10));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_definePageMeta = resolveComponent("definePageMeta");
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_definePageMeta, { layout: "dashboard" }, null, _parent));
      _push(`<div class="mb-6"><h1 class="text-2xl font-bold text-white">Users &amp; Staff</h1><p class="text-dark-400 text-sm mt-1">Manage platform users and staff accounts</p></div><div class="card mb-6"><div class="flex flex-wrap gap-3"><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Search users..." class="input max-w-xs"><select class="input max-w-[160px]"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "") : ssrLooseEqual(unref(roleFilter), "")) ? " selected" : ""}>All Roles</option><!--[-->`);
      ssrRenderList(["superadmin", "admin", "finance", "support", "viewer", "user"], (r) => {
        _push(`<option${ssrRenderAttr("value", r)}${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), r) : ssrLooseEqual(unref(roleFilter), r)) ? " selected" : ""}>${ssrInterpolate(r)}</option>`);
      });
      _push(`<!--]--></select></div></div><div class="table-container"><table class="data-table"><thead><tr><th>User</th><th>Type</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead><tbody>`);
      if (unref(loading)) {
        _push(`<tr><td colspan="6" class="text-center py-12 text-dark-400">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-6 h-6 animate-spin mx-auto"
        }, null, _parent));
        _push(`</td></tr>`);
      } else if (unref(users).length === 0) {
        _push(`<tr><td colspan="6" class="text-center py-12 text-dark-400">No users found</td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(users), (u) => {
          _push(`<tr><td><p class="font-medium text-white">${ssrInterpolate(u.fullName)}</p><p class="text-xs text-dark-400">${ssrInterpolate(u.email)}</p></td><td><span class="badge-info capitalize">${ssrInterpolate(u.userType)}</span></td><td><span class="badge-neutral capitalize">${ssrInterpolate(u.role)}</span></td><td><span class="${ssrRenderClass(u.isActive ? "badge-success" : "badge-danger")}">${ssrInterpolate(u.isActive ? "Active" : "Inactive")}</span></td><td class="text-dark-400 text-xs">${ssrInterpolate(u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "—")}</td><td><div class="flex gap-1">`);
          if (u.isActive) {
            _push(`<button class="btn-ghost btn-sm text-red-400">`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:user-x",
              class: "w-3.5 h-3.5"
            }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<button class="btn-ghost btn-sm text-emerald-400">`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "lucide:user-check",
              class: "w-3.5 h-3.5"
            }, null, _parent));
            _push(`</button>`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div>`);
      if (unref(totalPages) > 1) {
        _push(`<div class="flex items-center justify-between mt-4"><p class="text-sm text-dark-400">Page ${ssrInterpolate(unref(page))} of ${ssrInterpolate(unref(totalPages))}</p><div class="flex gap-2"><button${ssrIncludeBooleanAttr(unref(page) <= 1) ? " disabled" : ""} class="btn-secondary btn-sm">Prev</button><button${ssrIncludeBooleanAttr(unref(page) >= unref(totalPages)) ? " disabled" : ""} class="btn-secondary btn-sm">Next</button></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/users.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=users-CFWNHPNd.js.map
