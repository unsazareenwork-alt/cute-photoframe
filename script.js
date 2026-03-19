document.addEventListener("DOMContentLoaded", () => {

    const downloadBtn   = document.querySelectorAll(".cute-btn")[0];
    const takePhotoBtn  = document.querySelectorAll(".cute-btn")[1];
    const resetBtn      = document.querySelector(".btn2");
    const openCameraBtn = document.querySelector(".btn1");

    const frame1 = document.querySelector(".frame1");
    const frame2 = document.querySelector(".frame2");

    let stream    = null;
    let photoStep = 0;
    let photo1    = null;
    let photo2    = null;

    const video = document.createElement("video");
    video.autoplay    = true;
    video.playsInline = true;
    video.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";

    // OPEN CAMERA
    openCameraBtn.addEventListener("click", async () => {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        photoStep = 0;
        photo1 = null;
        photo2 = null;
        frame1.innerHTML = "";
        frame1.appendChild(video);
        frame2.innerHTML = "";
    });

    // RESET
    resetBtn.addEventListener("click", () => {
        if (stream) stream.getTracks().forEach(t => t.stop());
        video.srcObject = null;
        stream = null;
        photoStep = 0;
        photo1 = null;
        photo2 = null;
        frame1.innerHTML = "";
        frame2.innerHTML = "";
    });

    // TAKE PHOTO
    takePhotoBtn.addEventListener("click", () => {
        if (!stream) { alert("Open camera first!"); return; }

        const snap = document.createElement("canvas");
        snap.width  = video.videoWidth;
        snap.height = video.videoHeight;
        snap.getContext("2d").drawImage(video, 0, 0);
        snap.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";

        if (photoStep === 0) {
            photo1 = snap;
            frame1.innerHTML = "";
            frame1.appendChild(snap);
            frame2.innerHTML = "";
            frame2.appendChild(video);
            photoStep = 1;

        } else if (photoStep === 1) {
            photo2 = snap;
            frame2.innerHTML = "";
            frame2.appendChild(snap);
            photoStep = 2;
        }
    });

    // DOWNLOAD PHOTOSTRIP
    downloadBtn.addEventListener("click", () => {
        if (!photo1 || !photo2) { alert("Take both photos first!"); return; }

        const mainRect = document.querySelector(".frame-main").getBoundingClientRect();
        const f1Rect   = frame1.getBoundingClientRect();
        const f2Rect   = frame2.getBoundingClientRect();

        const f1x = f1Rect.left - mainRect.left;
        const f1y = f1Rect.top  - mainRect.top;
        const f2x = f2Rect.left - mainRect.left;
        const f2y = f2Rect.top  - mainRect.top;

        const out = document.createElement("canvas");
        out.width  = mainRect.width;
        out.height = mainRect.height;
        const ctx  = out.getContext("2d");

        function finish() {
            // pink borders behind frames
            ctx.fillStyle = "rgb(228,212,212)";
            ctx.fillRect(f1x - 20, f1y - 20, f1Rect.width + 40, f1Rect.height + 40);
            ctx.fillRect(f2x - 20, f2y - 20, f2Rect.width + 40, f2Rect.height + 40);

            // draw both photos
            ctx.drawImage(photo1, f1x, f1y, f1Rect.width, f1Rect.height);
            ctx.drawImage(photo2, f2x, f2y, f2Rect.width, f2Rect.height);

            // outer border
            ctx.strokeStyle = "rgb(88,24,24)";
            ctx.lineWidth = 4;
            ctx.strokeRect(2, 2, out.width - 4, out.height - 4);

            const a = document.createElement("a");
            a.download = "photostrip.png";
            a.href = out.toDataURL("image/png");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        const bg = new Image();
        bg.onload  = () => { ctx.drawImage(bg, 0, 0, out.width, out.height); finish(); };
        bg.onerror = () => { ctx.fillStyle = "#f0ddd0"; ctx.fillRect(0, 0, out.width, out.height); finish(); };
        bg.src = "bg2.jpeg";
    });

});