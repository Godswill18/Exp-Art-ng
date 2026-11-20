/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_IMAGE_URL?: string;
  readonly VITE_ALLOWED_ROLES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
