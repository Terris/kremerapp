export type ImageDimensions = {
  width?: number;
  height?: number;
};

export async function getImageDimensions(
  file: File
): Promise<ImageDimensions | undefined> {
  if (!file.type.includes("image")) return;
  const dimensions: ImageDimensions = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.src = URL.createObjectURL(file);
  });
  return await dimensions;
}
