export const jwtConstants = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  accessExpiresIn: '15d',
  refreshExpiresIn: '7d',
};