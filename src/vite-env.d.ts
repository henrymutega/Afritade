/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Add any other environment variables you use
  readonly VITE_APP_TITLE?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}