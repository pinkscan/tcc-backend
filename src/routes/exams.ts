import { Router } from "express";
import { prisma } from "../prisma";
import multer from "multer";
import { authMiddleware } from "../middleware/auth";

const upload = multer();
const router = Router();

router.post("/process", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada." });
    }

    const fastApiUrl = process.env.PIPELINE_URL || "http://localhost:8000/processar";

    // monta form-data para enviar ao Python
    const formData = new FormData();
    formData.append("file", new Blob([req.file.buffer]), req.file.originalname);

    const response = await fetch(fastApiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Erro na pipeline de IA." });
    }

    const result = await response.json();

    // salvar no banco
    const exam = await prisma.exam.create({
    data: {
        userId: req.userId,

        uuid: result.uuid,
        resultadoFinal: result.resultado_final,

        detect: result.detect,
        classify: result.classify,
        rawJson: result,

        s3Raw: result.s3.raw,
        s3Processed: result.s3.processed,
        s3ResultJson: result.s3.results_json,

        imagemTratadaBase64: result.imagem_tratada_base64
    }
    });





    return res.json({
      examId: exam.id,
      ...result,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
