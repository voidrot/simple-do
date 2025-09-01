<template>
  <div class="dropdown dropdown-end">
    <button
      class="btn btn-ghost btn-circle"
      tabindex="0"
      role="button"
      aria-label="Toggle theme"
    >
      <svg
        v-if="currentTheme === 'light'"
        class="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      <svg
        v-else
        class="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </button>
    <ul
      tabindex="0"
      class="dropdown-content z-[1] p-2 shadow-2xl bg-base-100 rounded-box max-h-64 overflow-y-auto"
      :style="{ width: dropdownWidth + 'px' }"
    >
      <li
        v-for="theme in availableThemes"
        :key="theme"
      >
        <button
          class="flex items-center gap-3 px-4 py-2 hover:bg-base-300 rounded-lg transition-colors w-full text-left"
          :class="{ 'bg-primary text-primary-content': currentTheme === theme }"
          @click="setTheme(theme)"
        >
          <div
            class="w-4 h-4 rounded-full border-2 border-base-content"
            :style="{ backgroundColor: getThemePreviewColor(theme) }"
          />
          <span class="capitalize">{{ theme }}</span>
          <svg
            v-if="currentTheme === theme"
            class="w-4 h-4 ml-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const availableThemes: string[] = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
]

const themeCookie = useCookie<string>('theme', {
  default: () => 'dark',
  watch: true,
})

const currentTheme = computed<string>(() => themeCookie.value)
const dropdownWidth = ref<number>(200) // Default width

const setTheme = (theme: string): void => {
  themeCookie.value = theme
}

function getThemePreviewColor(theme: string): string {
  // Simple color mapping for theme previews
  const colorMap: Record<string, string> = {
    light: '#ffffff',
    dark: '#1f2937',
    cupcake: '#faf7f5',
    bumblebee: '#f9f7f3',
    emerald: '#f3f4f6',
    corporate: '#f8fafc',
    synthwave: '#2d1b69',
    retro: '#e4d8b4',
    cyberpunk: '#0d001a',
    valentine: '#f8e1e7',
    halloween: '#1a1a1a',
    garden: '#f0f9ff',
    forest: '#1a2e1f',
    aqua: '#f0f9ff',
    lofi: '#f8f9fa',
    pastel: '#fef7ff',
    fantasy: '#f8f4f0',
    wireframe: '#ffffff',
    black: '#000000',
    luxury: '#09090b',
    dracula: '#282a36',
    cmyk: '#ffffff',
    autumn: '#fef3c7',
    business: '#f8fafc',
    acid: '#f0fdf4',
    lemonade: '#fefce8',
    night: '#0f172a',
    coffee: '#362d1d',
    winter: '#f0f9ff',
  }
  return colorMap[theme] || '#ffffff'
}

onMounted(() => {
  // Calculate dropdown width based on longest theme name
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (context) {
    context.font = '16px system-ui, -apple-system, sans-serif'
    const longestTheme = availableThemes.reduce((longest, current) =>
      context.measureText(current).width > context.measureText(longest).width ? current : longest,
    )
    const textWidth = context.measureText(longestTheme).width
    // Add padding for icon, spacing, and checkmark
    dropdownWidth.value = Math.max(200, textWidth + 80)
  }
})
</script>
