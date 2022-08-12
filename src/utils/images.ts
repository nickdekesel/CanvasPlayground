const images: Record<string, HTMLImageElement | ImageBitmap> = {};

const loadImage = (key: string, src: string) => {
  const image = new Image();
  image.src = src;
  images[key] = image;
};

const objects = ["camera", "lamp"];
export const IMAGE_OBJECT_SIZES = [32, 64, 64];
const uniqueObjectSizes = [...new Set(IMAGE_OBJECT_SIZES)];

for (let object of objects) {
  for (let objectSize of uniqueObjectSizes) {
    const objectId = `${object}${objectSize}`;
    loadImage(objectId, `images/${objectId}.png`);
  }
}

export { images };
