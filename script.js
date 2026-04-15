async function detectFace() {
  const fileInput = document.getElementById("imageInput");
  const endpoint = document.getElementById("endpoint").value;
  const apiKey = document.getElementById("apiKey").value;
  const resultDiv = document.getElementById("result");

  if (!fileInput.files[0]) {
    alert("Please upload an image");
    return;
  }

  const file = fileInput.files[0];

  // Show preview
  const img = document.getElementById("previewImage");
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    const response = await fetch(
      endpoint + "/face/v1.0/detect?returnFaceRectangle=true",
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "application/octet-stream"
        },
        body: file
      }
    );

    const data = await response.json();

    console.log(data);

    if (!data.length) {
      resultDiv.innerHTML = "No face detected ❌";
      return;
    }

    resultDiv.innerHTML = `Detected Faces: ${data.length}`;

    // Draw boxes
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 3;

    data.forEach(face => {
      const rect = face.faceRectangle;
      ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
    });
  };
}