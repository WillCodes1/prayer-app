import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lfd.sacredspace',
  appName: 'Sacred Space',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
