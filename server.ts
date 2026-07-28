import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for AI tutor / code explanations / lab helper
  app.post("/api/explain-code", async (req, res) => {
    try {
      const { code, question } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "GEMINI_API_KEY environment variable is not configured." });
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert 8085 Microprocessor Professor and Lab Instructor.
The student is asking: ${question || 'Explain this assembly code step-by-step and identify any bugs or logic improvements.'}

Student 8085 Assembly Code:
\`\`\`assembly
${code}
\`\`\`

Provide a clear, easy-to-understand explanation in Hinglish/English with key register states, memory flow, and practical tips for ET-8085 trainer kit lab submission.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI response" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
