import axios from "axios";

export default async function handler(req, res) {
  const { prompts } = req.body;
  console.log(prompts);
  const method = req.method;
  if (method === "POST") {
    try {
      const result = await axios({
        method: "POST",
        url: "https://api.anthropic.com/v1/messages",
        headers: {
          "x-api-key": process.env.CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        data: {
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          messages: prompts,
        },
      });
      console.log(result.data);
      res.status(200).json({
        payload: result.data.content[0],
      });
    } catch (err) {
      console.log(err.response);
      res.status(200).send("OK");
    }
  }
}
