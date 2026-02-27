module.exports = {
  apps: [
    {
      name: 'fooz-backend',
      script: 'dist/src/main.js',  
      watch: false,
      env: {
        NODE_ENV: 'development',
        DATABASE_URL: "postgresql://foozgaminguser:fooz2026%40%23%24j0@localhost:5432/foozgamingdb?schema=public",
        PORT: 3000,
        APP_URL: "https://api.fooz-gaming.com",
        JWT_SECRET: "g7hdd4b95899cba4b5ef916b8b9625eee020af3kd9fdfb672db684b5e1vmndb4249de6dece062d467d1b0aaad727220f743db05462ad260ea048fff7eb7e58057",
        TELEGRAM_BOT_TOKEN: "8317267714:AAF6mt_t64Z1a13QSmMt2nlaPubS7OvigD8",
        GROUP_CHAT_ID: "-1003860011348",
        ADMIN_EMAIL: "admin@fooz.com",
        ADMIN_DEFAULT_PASSWORD: "fooz@%97!"
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL: "postgresql://foozgaminguser:fooz2026%40%23%24j0@localhost:5432/foozgamingdb?schema=public",
        PORT: 3000,
        APP_URL: "https://api.fooz-gaming.com",
        JWT_SECRET: "g7hdd4b95899cba4b5ef916b8b9625eee020af3kd9fdfb672db684b5e1vmndb4249de6dece062d467d1b0aaad727220f743db05462ad260ea048fff7eb7e58057",
        TELEGRAM_BOT_TOKEN: "8317267714:AAF6mt_t64Z1a13QSmMt2nlaPubS7OvigD8",
        GROUP_CHAT_ID: "-1003860011348",
        ADMIN_EMAIL: "admin@fooz.com",
        ADMIN_DEFAULT_PASSWORD: "fooz@%97!"
      }
    }
  ]
};