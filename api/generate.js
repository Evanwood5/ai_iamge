export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt, n } = req.body;

  // ✅ Debug: log received request
  console.log("Received prompt:", prompt);
  console.log("Requested number of images:", n);

  // ✅ Debug: check if API key is loaded
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is missing from environment!");
    return res.status(500).json({ error: "Server configuration error: Missing API key" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        n: parseInt(n),
        size: "512x512",
        response_format: "b64_json"
      })
    });

    const data = await response.json();

    // ✅ Debug: Log full response from OpenAI
    console.log("OpenAI response status:", response.status);
    console.log("OpenAI response data:", JSON.stringify(data, null, 2));

    if (!data?.data) {
      return res.status(500).json({ error: "No images returned from OpenAI" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error contacting OpenAI:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
}
