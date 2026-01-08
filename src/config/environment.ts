export const environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/catdb',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  catApiKey: process.env.CAT_API_KEY || 'live_JBT0Ah0Nt12iyl2IpjQVLDWjcLk0GQwf4zI9wBMfmfejKmcC31mOJp4yJz5TsOUP',
  catApiUrl: process.env.CAT_API_URL || 'https://api.thecatapi.com/v1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:4200']
};