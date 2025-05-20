import { defineConfig} from "vite";

export default defineConfig({
    test: {
        environment: "jsdom"
    },

    esbuild: {
        jsx: 'automatic',
        jsxInject: `import React from 'react'`,
      },
});