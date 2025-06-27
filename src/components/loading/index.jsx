import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black">
      <Image
        src="/logo.png"
        width={200}
        height={200}
        alt="DAI logo"
        className="animate-pulse-smooth"
      />
      <div className="text-white text-lg font-medium tracking-wide flex items-center gap-1">
        Cargando
        <span className="loading-dot delay-0">.</span>
        <span className="loading-dot delay-1">.</span>
        <span className="loading-dot delay-2">.</span>
      </div>
    </div>
  );
};

export default Loading;

