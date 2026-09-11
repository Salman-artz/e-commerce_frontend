import { defineConfig, presetUno, presetIcons, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        inter: 'Inter:400,500,600,700'
      }
    })
  ],
  theme: {
    colors: {
      page: '#FAFAFA',
      surface: '#FFFFFF',
      textPrimary: '#0A0A0A',
      textSecondary: '#737373',
      accent: '#18181B',
      brand: '#6366F1',
      success: '#22C55E',
      warning: '#EAB308',
      danger: '#EF4444',
      border: '#E5E5E5'
    }
  },
  shortcuts: {
    'btn-base': 'inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    'btn-primary': 'btn-base bg-accent text-white hover:bg-black',
    'btn-secondary': 'btn-base bg-surface border border-border text-textPrimary hover:bg-page',
    'btn-ghost': 'btn-base text-textPrimary hover:bg-page',
    'btn-danger': 'btn-base bg-danger text-white hover:bg-red-600',
    'card': 'bg-surface rounded-xl border border-border shadow-sm',
    'input-field': 'w-full px-3 py-2 bg-surface border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow',
    'app-container': 'w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px]'
  }
})
