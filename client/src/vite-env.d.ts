/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_IMAGE_URL?: string;
  /** Legacy names, still honoured so existing deployments keep working. */
  readonly VITE_BACKEND_API_URL?: string;
  readonly VITE_BACKEND_IMAGE_URL?: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_SEND_CAPTCHA_TOKEN?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
