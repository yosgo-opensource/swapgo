import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { type, input, voice, prompt } = req.body;

  if (
    !type ||
    (type === "tts" && (!input || !voice)) ||
    (type === "image" && !prompt)
  ) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    let response;

    if (type === "tts") {
      response = await axios.post(
        "https://api.openai.com/v1/audio/speech",
        {
          model: "tts-1",
          input: input,
          voice: voice,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      res.setHeader("Content-Type", "audio/mpeg");
      return res.send(response.data);
    } else if (type === "image") {
      response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json(response.data);
    }
  } catch (error) {
    console.error(
      "Error calling OpenAI API:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({
        message: "Error processing request",
        error: error.response?.data || error.message,
      });
  }
}
