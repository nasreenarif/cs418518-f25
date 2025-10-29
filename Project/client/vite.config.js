import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: 
    [react(),    
    tailwindcss(),
],
// server: {
//     headers: {      
//       "Content-Security-Policy": "frame-ancestors 'self'"
//     }
//   }
})
