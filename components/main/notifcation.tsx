// components/NotificationPopup.tsx
export default function NotificationPopup() {
  return (
    <div className="absolute top-16 right-7 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Notifications</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>🍎 Don’t forget your morning smoothie!</li>
          <li>💧 Time to drink water.</li>
          <li>🏃 Your activity goal is almost done!</li>
        </ul>
      </div>
    </div>
  );
}
