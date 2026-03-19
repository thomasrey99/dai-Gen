"use client";

export default function MapPreview({ url, lat, lng }) {
  if (!lat || !lng ) return null;
  const streetUrl = `https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&location=${lat},${lng}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      
      <iframe
        title="Mapa"
        src={url}
        className="w-full h-[300px] rounded-xl shadow"
      />

      <iframe
        title="Street View"
        src={streetUrl}
        className="w-full h-[300px] rounded-xl shadow"
      />

    </div>
  );
}