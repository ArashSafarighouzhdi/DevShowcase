"use client";

import { useState } from "react";

type ImageGalleryProps = {
  images: string[];
  title: string;
};

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {images.map((image) => (
          <img
            key={image}
            src={image}
            alt={title}
            onClick={() => setSelectedImage(image)}
            className="w-full cursor-pointer rounded-xl"
          />
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt={title}
            className="max-h-full max-w-full rounded-xl"
          />
        </div>
      )}
    </>
  );
};

export default ImageGallery;
