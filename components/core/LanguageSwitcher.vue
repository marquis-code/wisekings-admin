<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm group"
    >
      <Icon :name="currentLocaleIcon" class="w-4 h-4 text-[#033958]" />
      <span class="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#033958] transition-colors">
        {{ currentLocaleName }}
      </span>
      <Icon 
        name="lucide:chevron-up" 
        class="w-3 h-3 text-gray-300 transition-transform duration-300" 
        :class="{ 'rotate-180': isOpen }" 
      />
    </button>

    <transition name="slide-up">
      <div
        v-if="isOpen"
        class="absolute bottom-full mb-2 right-0 w-40 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-[100] overflow-hidden"
      >
        <button
          v-for="locale in locales"
          :key="locale.code"
          @click="setLocale(locale.code)"
          class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
        >
          <div class="flex items-center gap-3">
             <Icon :name="getLocaleIcon(locale.code)" class="w-4 h-4" :class="currentLocale === locale.code ? 'text-[#033958]' : 'text-gray-300'" />
             <span class="text-[10px] font-black uppercase tracking-widest" :class="currentLocale === locale.code ? 'text-[#033958]' : 'text-gray-500'">
               {{ locale.name }}
             </span>
          </div>
          <Icon v-if="currentLocale === locale.code" name="lucide:check" class="w-3 h-3 text-[#033958]" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const currentLocale = computed(() => locale.value)
const currentLocaleName = computed(() => {
  const found = (locales.value as any[]).find(l => l.code === locale.value)
  return found ? found.name : 'Language'
})

const currentLocaleIcon = computed(() => getLocaleIcon(locale.value))

function getLocaleIcon(code: string) {
  const icons: Record<string, string> = {
    en: 'circle-flags:uk',
    fr: 'circle-flags:fr',
    es: 'circle-flags:es'
  }
  return icons[code] || 'lucide:languages'
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// Close on outside click
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
      isOpen.value = false
    }
  })
})
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { 
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
}
.slide-up-enter-from, .slide-up-leave-to { 
  opacity: 0; 
  transform: translateY(10px); 
}
</style>
