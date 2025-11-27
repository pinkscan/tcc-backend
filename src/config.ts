export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "7c2ffc1d983d21fe4e0401651b1ee525",
  inferenceApiUrl: process.env.PIPELINE_URL || "http://localhost:8000/processar",
};
