/**
 * Telefondan olingan rasmni yuklashdan oldin kichraytirish: eng uzun tomoni 1200px, JPEG ~85%.
 * 5–10 MB kamera surati ~150–300 KB ga tushadi — tez yuklanadi va bazada kam joy egallaydi.
 */
const MAX_SIDE = 1200;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('INVALID_IMAGE'));
    };
    image.src = url;
  });
}

export async function resizeImage(file: File): Promise<Blob> {
  // <img> EXIF yo'nalishini o'zi hisobga oladi (telefonda yonboshlab qolmaydi)
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('INVALID_IMAGE');
  context.fillStyle = '#ffffff'; // shaffof PNG qora bo'lib qolmasin
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  for (const quality of [0.85, 0.75, 0.6]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (blob && blob.size <= 2.5 * 1024 * 1024) return blob;
  }
  throw new Error('INVALID_IMAGE');
}
