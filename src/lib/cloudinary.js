// Cloudinary Image Upload Utility with Client-Side Optimization & Smart AI 1:1 Auto-Cropping

/**
 * Pre-processes an image file on an HTML5 canvas:
 * 1. Resizes & center-crops to a 1:1 square ratio.
 * 2. Compresses file size (max 600x600 px, 85% JPEG quality) before network upload.
 */
export async function optimizeImageClientSide(file, targetSize = 600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate 1:1 square cropping box retaining maximum photo area
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        const finalDim = Math.min(minDim, targetSize);
        canvas.width = finalDim;
        canvas.height = finalDim;

        // Draw centered square crop with smooth bicubic scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, finalDim, finalDim);

        // Convert canvas to compressed JPEG Blob (~50KB-100KB)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '') + '-optimized.jpg',
                { type: 'image/jpeg' }
              );
              resolve(optimizedFile);
            } else {
              resolve(file); // Fallback to original file if blob creation fails
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => resolve(file); // Fallback to original file on error
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads optimized image to Cloudinary & applies Cloudinary AI smart face/subject detection 1:1 auto-crop.
 */
export async function uploadImageToCloudinary(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary setup missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in environment variables.'
    );
  }

  // Step 1: Optimize & crop image on client canvas BEFORE upload
  const optimizedFile = await optimizeImageClientSide(file, 600);

  // Step 2: Upload optimized image to Cloudinary
  const formData = new FormData();
  formData.append('file', optimizedFile);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary.');
  }

  const data = await response.json();
  let url = data.secure_url;

  // Step 3: Apply Cloudinary AI auto-face/subject smart 1:1 crop URL transformation
  if (url && url.includes('/upload/')) {
    url = url.replace('/upload/', '/upload/c_fill,g_auto,w_500,h_500,q_auto,f_auto/');
  }

  return url;
}
