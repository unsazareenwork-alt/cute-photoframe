// Wait until HTML loads (prevents undefined element errors)
document.addEventListener("DOMContentLoaded", () => {

    // Select buttons
    const buttons = document.querySelectorAll(".btn");

    const downloadBtn = buttons[0];
    const takePhotoBtn = buttons[1];
    const resetBtn = buttons[2];

    const openCameraBtn = document.querySelector(".btn1");

    // Select frames
    const frame1 = document.querySelector(".frame1");
    const frame2 = document.querySelector(".frame2");

    // Create video preview
    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";

    // Canvas for capturing photo
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let photoStep = 0;
    let stream = null;

    // OPEN CAMERA
    openCameraBtn.addEventListener("click", async () => {

        try {

            stream = await navigator.mediaDevices.getUserMedia({ video: true });

            video.srcObject = stream;

            // Show preview in first frame
            frame1.innerHTML = "";
            frame1.appendChild(video);

        } catch (error) {

            alert("Camera access denied");

        }

    });

    // TAKE PHOTO
    takePhotoBtn.addEventListener("click", () => {

        if (!stream) {
            alert("Open camera first");
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0);

        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";

        // First photo
        if (photoStep === 0) {

            frame1.innerHTML = "";
            frame1.appendChild(img);

            // Move camera preview to second frame
            frame2.innerHTML = "";
            frame2.appendChild(video);

            photoStep++;

        }

        // Second photo
        else if (photoStep === 1) {

            frame2.innerHTML = "";
            frame2.appendChild(img);

            photoStep++;

        }

    });

    // RESET STRIP
    resetBtn.addEventListener("click", () => {

        frame1.innerHTML = "<p>take img</p>";
        frame2.innerHTML = "<p>take img2</p>";

        photoStep = 0;

    });

    // DOWNLOAD PHOTOSTRIP
    downloadBtn.addEventListener("click", () => {

        const img1 = frame1.querySelector("img");
        const img2 = frame2.querySelector("img");

        if (!img1 || !img2) {
            alert("Take both photos first");
            return;
        }

        const stripCanvas = document.createElement("canvas");
        const stripCtx = stripCanvas.getContext("2d");

        // Canvas size
        stripCanvas.width = 400;
        stripCanvas.height = 550;

        // Background
        stripCtx.fillStyle = "white";
        stripCtx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

        const photoWidth = 350;
        const photoHeight = 230;

        const x = 25;
        const y1 = 30;
        const y2 = 290;

        // Frame border
        stripCtx.fillStyle = "#808080";

        stripCtx.fillRect(x - 10, y1 - 10, photoWidth + 20, photoHeight + 20);
        stripCtx.fillRect(x - 10, y2 - 10, photoWidth + 20, photoHeight + 20);

        // Draw photos
        stripCtx.drawImage(img1, x, y1, photoWidth, photoHeight);
        stripCtx.drawImage(img2, x, y2, photoWidth, photoHeight);

        // Download image
        const link = document.createElement("a");
        link.download = "photostrip.png";
        link.href = stripCanvas.toDataURL("image/png");

        link.click();

    });

});