import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPhotosOfUser } from "../../api";

const PhotoGridShimmer = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="aspect-square rounded-lg animate-shimmer shadow-sm"
      />
    ))}
  </div>
);

const Photos = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['photos'],
    queryFn: () => getAllPhotosOfUser(),
  });

  if (isLoading) return <PhotoGridShimmer />;
  if (isError) {
    return (
      <div className="m-4 rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
        Error loading photos.
      </div>
    );
  }

  const userImages = data?.userImage || [];
  const postImages = data?.postImages || [];

  // dono arrays combine kar diye
  const allPhotos = [...userImages, ...postImages];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {allPhotos.map((photo, index) => (
        <img
          key={photo.id || index}
          src={photo.image}
          alt={`User Photo ${index + 1}`}
          className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
        />
      ))}
    </div>
  );
};

export default Photos;
