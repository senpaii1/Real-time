module.exports = {
  apps: [
    {
      name: "real-time", // Name of your application
      script: "./server.js", // Path to your entry script
      instances: "1", // Number of instances to run, 'max' uses all available CPU cores
      autorestart: true, // Automatically restart the app if it crashes
      watch: true, // Watch for file changes and restart automatically
      max_memory_restart: "1G", // Restart the app if it exceeds 1 GB of memory
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        MONGODB_URI:
          "mongodb+srv://senpaii:tzuyu__1%40@dev.bgwwoso.mongodb.net/chat_box",
        SECRET_KEY: "LearnGo", // Environment variables for development
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGODB_URI:
          "mongodb+srv://senpaii:tzuyu__1%40@dev.bgwwoso.mongodb.net/chat_box",
        SECRET_KEY: "LearnGo", // Environment variables for production
      },
    },
  ],
};
