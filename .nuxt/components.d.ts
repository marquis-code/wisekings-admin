
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


export const AiAssistant: typeof import("../components/ai/AiAssistant.vue")['default']
export const ChatWidget: typeof import("../components/chat/ChatWidget.vue")['default']
export const CoreAnimatedInput: typeof import("../components/core/AnimatedInput.vue")['default']
export const CoreConfirmModal: typeof import("../components/core/ConfirmModal.vue")['default']
export const CoreEmptyState: typeof import("../components/core/EmptyState.vue")['default']
export const CoreImageUpload: typeof import("../components/core/ImageUpload.vue")['default']
export const CoreImageUploader: typeof import("../components/core/ImageUploader.vue")['default']
export const CoreKycDocumentModal: typeof import("../components/core/KycDocumentModal.vue")['default']
export const CorePasswordInput: typeof import("../components/core/PasswordInput.vue")['default']
export const CorePhoneInput: typeof import("../components/core/PhoneInput.vue")['default']
export const CoreRichTextEditor: typeof import("../components/core/RichTextEditor.vue")['default']
export const CoreSelectInput: typeof import("../components/core/SelectInput.vue")['default']
export const CoreSkeletonLoader: typeof import("../components/core/SkeletonLoader.vue")['default']
export const CoreToast: typeof import("../components/core/Toast.vue")['default']
export const MarketingCampaignModal: typeof import("../components/marketing/CampaignModal.vue")['default']
export const MarketingTemplateEditorModal: typeof import("../components/marketing/TemplateEditorModal.vue")['default']
export const UsersUserInviteModal: typeof import("../components/users/UserInviteModal.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const Icon: typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
export const NuxtLinkLocale: typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
export const SwitchLocalePathLink: typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAiAssistant: LazyComponent<typeof import("../components/ai/AiAssistant.vue")['default']>
export const LazyChatWidget: LazyComponent<typeof import("../components/chat/ChatWidget.vue")['default']>
export const LazyCoreAnimatedInput: LazyComponent<typeof import("../components/core/AnimatedInput.vue")['default']>
export const LazyCoreConfirmModal: LazyComponent<typeof import("../components/core/ConfirmModal.vue")['default']>
export const LazyCoreEmptyState: LazyComponent<typeof import("../components/core/EmptyState.vue")['default']>
export const LazyCoreImageUpload: LazyComponent<typeof import("../components/core/ImageUpload.vue")['default']>
export const LazyCoreImageUploader: LazyComponent<typeof import("../components/core/ImageUploader.vue")['default']>
export const LazyCoreKycDocumentModal: LazyComponent<typeof import("../components/core/KycDocumentModal.vue")['default']>
export const LazyCorePasswordInput: LazyComponent<typeof import("../components/core/PasswordInput.vue")['default']>
export const LazyCorePhoneInput: LazyComponent<typeof import("../components/core/PhoneInput.vue")['default']>
export const LazyCoreRichTextEditor: LazyComponent<typeof import("../components/core/RichTextEditor.vue")['default']>
export const LazyCoreSelectInput: LazyComponent<typeof import("../components/core/SelectInput.vue")['default']>
export const LazyCoreSkeletonLoader: LazyComponent<typeof import("../components/core/SkeletonLoader.vue")['default']>
export const LazyCoreToast: LazyComponent<typeof import("../components/core/Toast.vue")['default']>
export const LazyMarketingCampaignModal: LazyComponent<typeof import("../components/marketing/CampaignModal.vue")['default']>
export const LazyMarketingTemplateEditorModal: LazyComponent<typeof import("../components/marketing/TemplateEditorModal.vue")['default']>
export const LazyUsersUserInviteModal: LazyComponent<typeof import("../components/users/UserInviteModal.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyIcon: LazyComponent<typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
export const LazyNuxtLinkLocale: LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
export const LazySwitchLocalePathLink: LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
