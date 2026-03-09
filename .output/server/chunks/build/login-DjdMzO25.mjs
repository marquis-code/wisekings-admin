import { d as useAuthState, b as useToast, c as __nuxt_component_1 } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-j7LYAefj.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderDynamicModel, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrInterpolate } from 'vue/server-renderer';
import { u as useAuthApi } from './useAuthApi-Cz5TjfSb.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const rememberMe = ref(false);
    const loading = ref(false);
    const errorMessage = ref("");
    useAuthApi();
    useAuthState();
    useToast();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-dark-950 p-4" }, _attrs))}><div class="w-full max-w-md"><div class="text-center mb-8"><div class="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 items-center justify-center mb-4"><span class="text-2xl font-bold text-white">WK</span></div><h1 class="text-2xl font-bold text-white">WiseKings Admin</h1><p class="text-dark-400 mt-1">Sign in to your admin account</p></div><form class="card space-y-5"><div><label class="label">Email</label><input${ssrRenderAttr("value", unref(email))} type="email" class="input" placeholder="admin@wisekings.ng" required autocomplete="email"></div><div><label class="label">Password</label><div class="relative"><input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} class="input pr-10" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required autocomplete="current-password"><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: unref(showPassword) ? "lucide:eye-off" : "lucide:eye",
        class: "w-4 h-4"
      }, null, _parent));
      _push(`</button></div></div><div class="flex items-center justify-between text-sm"><label class="flex items-center gap-2 text-dark-400"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(rememberMe)) ? ssrLooseContain(unref(rememberMe), null) : unref(rememberMe)) ? " checked" : ""} class="rounded bg-dark-800 border-dark-600 text-primary-600 focus:ring-primary-500"> Remember me </label>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/forgot-password",
        class: "text-primary-400 hover:text-primary-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Forgot password? `);
          } else {
            return [
              createTextVNode(" Forgot password? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button type="submit" class="btn-primary w-full"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-4 h-4 animate-spin"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(unref(loading) ? "Signing in..." : "Sign in")}</span></button>`);
      if (unref(errorMessage)) {
        _push(`<p class="text-red-400 text-sm text-center">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DjdMzO25.mjs.map
