// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getAllPhotosOfUser } from "../../api";

// const Photos = () => {
//   const { data: photos, isLoading, isError } = useQuery({
//     queryKey: ['photos'],
//     queryFn: () => getAllPhotosOfUser(),
//   });

//   console.log("Photos data:", photos);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error loading photos.</div>;
//   }

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
//       {photos && photos.map(photo => (
//         <img
//           key={photo.id}
//           src={photo.url}
//           alt={photo.title}
//           className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
//         />
//       ))}
//     </div>
//   );
// };

// export default Photos;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPhotosOfUser } from "../../api";

const Photos = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['photos'],
    queryFn: () => getAllPhotosOfUser(),
  });

  console.log("Photos data:", data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading photos.</div>;

  const userImages = data?.userImage || [];
  const postImages = data?.postImages || [];

  // dono arrays combine kar diye
  const allPhotos = [...userImages, ...postImages];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {allPhotos.map((photo, index) => (
        console.log("Rendering photo:", photo),
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
