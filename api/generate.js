// api/generate.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt, n } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        n: parseInt(n),
        size: "512x512",
        response_format: "b64_json"
      })
    });

    const data = await response.json();

    // ✅ Add logging here
    console.log("Prompt:", prompt);
    console.log("Images returned:", data?.data?.length);
    console.log("Full response from OpenAI:", data);

    if (!data?.data) {
      return res.status(500).json({ error: "No images returned" });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Image generation failed" });
  }
}
