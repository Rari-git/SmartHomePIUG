import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Esențial: forțează linkurile din HTML să fie relative (./assets) în loc de absolute (/)
  build: {
    outDir: 'dist',
    target: 'esnext' // Optim pentru Electron, folosind funcțiile native rapide ale motorului V8
  }
});