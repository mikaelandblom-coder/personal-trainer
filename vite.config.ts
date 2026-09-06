import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://<user>.github.io/personal-trainer/
export default defineConfig({
  plugins: [react()],
  base: '/personal-trainer/',
})
