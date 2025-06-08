export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt, n } = req.body;

  try {
    console.log("Calling OpenAI with prompt:", prompt);
    console.log("OpenAI Key exists:", !!process.env.OPENAI_API_KEY);

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-2", // <-- REQUIRED
        prompt,
        n: parseInt(n),
        size: "512x512",
        response_format: "b64_json"
      })
    });

    const data = await response.json();

    if (!data?.data) {
      console.error("No image data returned:", data);
      return res.status(500).json({ error: "No images returned from OpenAI" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error calling OpenAI:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
}
