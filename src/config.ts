export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  inferenceApiUrl: process.env.INFERENCE_API_URL || "http://localhost:8000/processar",
};
