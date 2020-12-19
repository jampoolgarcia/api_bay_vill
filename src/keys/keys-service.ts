export namespace ServiceKey {
  export const TOKEN_EXPIRATIONS_TIMES = Math.floor(Date.now() / 1000) * 3600;
  export const JWT_SECRET_KEYS = "JWT@SecretKeys";
}
