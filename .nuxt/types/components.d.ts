
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  AiAssistant: typeof import("../../components/ai/AiAssistant.vue")['default']
  ChatWidget: typeof import("../../components/chat/ChatWidget.vue")['default']
  CoreAnimatedInput: typeof import("../../components/core/AnimatedInput.vue")['default']
  CoreConfirmModal: typeof import("../../components/core/ConfirmModal.vue")['default']
  CoreEmptyState: typeof import("../../components/core/EmptyState.vue")['default']
  CoreImageUpload: typeof import("../../components/core/ImageUpload.vue")['default']
  CoreImageUploader: typeof import("../../components/core/ImageUploader.vue")['default']
  CoreKycDocumentModal: typeof import("../../components/core/KycDocumentModal.vue")['default']
  CorePasswordInput: typeof import("../../components/core/PasswordInput.vue")['default']
  CorePhoneInput: typeof import("../../components/core/PhoneInput.vue")['default']
  CoreRichTextEditor: typeof import("../../components/core/RichTextEditor.vue")['default']
  CoreSelectInput: typeof import("../../components/core/SelectInput.vue")['default']
  CoreSkeletonLoader: typeof import("../../components/core/SkeletonLoader.vue")['default']
  CoreToast: typeof import("../../components/core/Toast.vue")['default']
  MarketingCampaignModal: typeof import("../../components/marketing/CampaignModal.vue")['default']
  MarketingTemplateEditorModal: typeof import("../../components/marketing/TemplateEditorModal.vue")['default']
  UsersUserInviteModal: typeof import("../../components/users/UserInviteModal.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  Icon: typeof import("../../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
  NuxtLinkLocale: typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
  SwitchLocalePathLink: typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyAiAssistant: LazyComponent<typeof import("../../components/ai/AiAssistant.vue")['default']>
  LazyChatWidget: LazyComponent<typeof import("../../components/chat/ChatWidget.vue")['default']>
  LazyCoreAnimatedInput: LazyComponent<typeof import("../../components/core/AnimatedInput.vue")['default']>
  LazyCoreConfirmModal: LazyComponent<typeof import("../../components/core/ConfirmModal.vue")['default']>
  LazyCoreEmptyState: LazyComponent<typeof import("../../components/core/EmptyState.vue")['default']>
  LazyCoreImageUpload: LazyComponent<typeof import("../../components/core/ImageUpload.vue")['default']>
  LazyCoreImageUploader: LazyComponent<typeof import("../../components/core/ImageUploader.vue")['default']>
  LazyCoreKycDocumentModal: LazyComponent<typeof import("../../components/core/KycDocumentModal.vue")['default']>
  LazyCorePasswordInput: LazyComponent<typeof import("../../components/core/PasswordInput.vue")['default']>
  LazyCorePhoneInput: LazyComponent<typeof import("../../components/core/PhoneInput.vue")['default']>
  LazyCoreRichTextEditor: LazyComponent<typeof import("../../components/core/RichTextEditor.vue")['default']>
  LazyCoreSelectInput: LazyComponent<typeof import("../../components/core/SelectInput.vue")['default']>
  LazyCoreSkeletonLoader: LazyComponent<typeof import("../../components/core/SkeletonLoader.vue")['default']>
  LazyCoreToast: LazyComponent<typeof import("../../components/core/Toast.vue")['default']>
  LazyMarketingCampaignModal: LazyComponent<typeof import("../../components/marketing/CampaignModal.vue")['default']>
  LazyMarketingTemplateEditorModal: LazyComponent<typeof import("../../components/marketing/TemplateEditorModal.vue")['default']>
  LazyUsersUserInviteModal: LazyComponent<typeof import("../../components/users/UserInviteModal.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyIcon: LazyComponent<typeof import("../../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
  LazyNuxtLinkLocale: LazyComponent<typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
  LazySwitchLocalePathLink: LazyComponent<typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
