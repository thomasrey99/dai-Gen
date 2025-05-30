"use client";

export default function Map({ url }) {
  if (!url) return null;

  return (
    <div className="w-full mt-4">
      <iframe
        title="Ubicación en Google Maps"
        width="100%"
        height="400"
        className="rounded-xl shadow-lg"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={url}
      />
    </div>
  );
}
