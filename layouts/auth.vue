<template>
  <div class="min-h-screen flex bg-white font-inter selection:bg-[#033958] selection:text-white">
    <!-- Left Side: Immersive Branding & Image -->
    <div class="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-[#0a0a0a] sticky top-0 h-screen">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img 
          src="@/assets/images/group.jpg" 
          alt="Admin Command Center" 
          class="w-full h-full object-cover opacity-60 scale-100 group-hover:scale-105 transition-transform duration-[10s]"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
        <div class="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>
      
      <!-- Content Overlay -->
      <div class="relative z-10 flex flex-col justify-between p-20 w-full h-full">
        <!-- Logo -->
        <div>
          <NuxtLink to="/" class="flex items-center gap-4 group">
           <img src="@/assets/images/logo.jpg" class="w-auto h-12" />
          </NuxtLink>
        </div>

        <!-- Featured Content -->
        <div class="max-w-2xl">
          <h1 class="text-7xl font-black text-white leading-[0.95] mb-10 tracking-tighter">
            Total Control.<br/>
            <span class="italic text-emerald-400 underline decoration-emerald-400/30 underline-offset-8">Zero Compromise.</span>
          </h1>
          <p class="text-xl text-white/50 leading-relaxed font-medium max-w-lg">
            Access the central core of the WiseKings ecosystem. Monitor global operations, manage assets, and deploy resources in real-time.
          </p>
        </div>

        <!-- Footer Info -->
        <div class="flex items-center gap-16 border-t border-white/10 pt-12">
          <div class="flex flex-col gap-2">
            <span class="text-4xl font-black text-white tracking-tighter">Secure</span>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">256-Bit Encrypted</span>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-4xl font-black text-white tracking-tighter">Live</span>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Global Sync Active</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side: Auth Form Content -->
    <div class="w-full lg:w-2/5 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative bg-white">
      <!-- Mobile Logo -->
      <div class="absolute top-12 left-10 lg:hidden">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-10 h-10 bg-[#033958] rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg italic">W</span>
          </div>
        </NuxtLink>
      </div>

      <div class="w-full max-w-md mx-auto space-y-10">
        <slot />
      </div>
      
      <!-- Rights Footer -->
      <div class="absolute bottom-12 left-0 right-0 text-center px-6">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">
          &copy; {{ new Date().getFullYear() }} WiseKings ERP. Authentication Required.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>
