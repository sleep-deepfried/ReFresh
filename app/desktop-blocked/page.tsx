import Image from "next/image"; // app/desktop-restricted/page.tsx

export default function DesktopRestricted() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold mb-4">Mobile Only Application</h1>
        <p className="mb-6">
          This application is designed for mobile devices only. Please access it
          from your smartphone or tablet.
        </p>
        <div className="mt-4">
          <Image
            src="/qr-code-placeholder.svg"
            width={192}
            height={192}
            alt="QR Code"
            className="mx-auto w-48 h-48"
          />
          <p className="mt-2 text-sm">
            Scan this QR code with your mobile device
          </p>
        </div>
      </div>
    </div>
  );
}
