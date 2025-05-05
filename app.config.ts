import 'dotenv/config';

export default {
  expo: {
    name: 'Project Pwned',
    slug: 'project-pwned',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png', // optional
    splash: {
      image: './assets/splash.png', // optional
      resizeMode: 'contain',
      backgroundColor: '#000000'
    },
    extra: {
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
