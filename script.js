// script.js

const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
  console.log("API Response Data:", imgDataArray);

  if (!Array.isArray(imgDataArray)) {
    alert("No image data returned from the server.");
    return;
  }

  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");

    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImg;

    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImg);
      downloadBtn.setAttribute("download", `${Date.now()}.jpg`);
    };
  });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: userPrompt,
        n: parseInt(userImgQuantity),
        size: "512x512",
        response_format: "b64_json"
      })
    });

    const result = await response.json();
    if (!response.ok || !result?.data) {
      throw new Error(result.error || "No images returned");
    }

    updateImageCard(result.data);
  } catch (error) {
    alert(error.message);
  } finally {
    isImageGenerating = false;
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;
  isImageGenerating = true;

  const userPrompt = e.target[0].value;
  const userImgQuantity = e.target[1].value;

  const imgCardMarkup = Array.from({ length: userImgQuantity }, () => `
    <div class="img-card loading">
      <img src="/images/loading.svg" alt="loading">
      <a href="#" class="download-btn">
        <img src="/images/download.png" alt="download icon">
      </a>
    </div>
  `).join("");

  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
