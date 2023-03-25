export default () => ({
    PORT: parseInt(process.env.PORT, 10) || 3000,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
});