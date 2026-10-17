const paths = {
  arrow: "M4 12h16m-6-6 6 6-6 6",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 22v-3a8 8 0 0 1 16 0v3",
  cart: "M2 3h3l3 13h11l3-10H6m3 14h.01M18 20h.01",
  layers: "m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5",
  blocks:
    "m3 6 5-3 5 3-5 3-5-3Zm0 0v7l5 3 5-3V6M8 9v7m5-3 5-3 5 3-5 3-5-3Zm0 0v7l5 3 5-3v-7m-5 3v7",
  hardhat:
    "M3 17h18v3H3v-3Zm2 0v-3a7 7 0 0 1 14 0v3M9 8v9m6-9v9",
  wrench:
    "M22 7a5 5 0 0 1-6.6 4.7l-8.2 8.2a2 2 0 1 1-2.8-2.8l8.2-8.2A5 5 0 0 1 17.3 2L14 5.3l4.7 4.7L22 7Z",
  "paint-roller":
    "M16.4 3.2a2 2 0 0 1 2.8 0l1.6 1.6a2 2 0 0 1 0 2.8l-3.3 3.3-4.4-4.4 3.3-3.3ZM13.1 6.5l-4.9 4.9 4.4 4.4 4.9-4.9M8.2 11.4l-5.1 5.1a2 2 0 1 0 2.8 2.8l5.1-5.1",
  zap: "m13 2-10 12h7l-1 8L21 9h-7l-1-7Z",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4m-4 9 3 3 5-6",
  box: "m12 2 10 5v10l-10 5-10-5V7l10-5m-10 5 10 5 10-5m-10 5v10M7 4.5l10 5",
  truck:
    "M1 4h13v13H1V4m13 5h5l4 5v3h-9M8 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0m13 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  pin: "M20 9c0 6-8 13-8 13S4 15 4 9a8 8 0 1 1 16 0m-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  menu: "M3 6h18M3 12h18M3 18h18",
};

export default function Icon({ name, className = "" }) {
  return (
    <svg
      className={`home-icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
