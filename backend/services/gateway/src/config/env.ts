export const env = {
  PORT: process.env.PORT || 3006,
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  ADMIN_SERVICE_URL: process.env.ADMIN_SERVICE_URL || 'http://localhost:3002',
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003',
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
  ACTIVITY_SERVICE_URL: process.env.ACTIVITY_SERVICE_URL || 'http://localhost:3005',
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
}