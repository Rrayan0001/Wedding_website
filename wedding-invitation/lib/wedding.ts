export type EventKind = "haldi" | "nikah" | "valima";

export type WeddingEvent = {
  kind: EventKind;
  title: string;
  side: "left" | "right";
  datetime: string;
  datetimeSuffix?: string;
  venueName: string;
  venueAddress: string[];
  mapUrl: string;
};
export const wedding = {
  bride: { firstName: "Rabiya", fullName: "Dr. Rabiya Sultana" },
  groom: { firstName: "Suhail", fullName: "Dr. Suhail Ahmed" },
  monogram: "RS",
  bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  bismillahTranslation: "In the name of Allah, the most beneficent and the most merciful",
  dateISO: "2026-11-29T11:30:00+05:30",
  cardDates: "26 . 11 . 2026 • 29 . 11 . 2026 • 01 . 12 . 2026",
  mainDate: "Sunday, 29th November 2026",
  mainTimePlace: "11:30 AM • Bangalore Palace, Bengaluru",
  closingMessage:
    "With the grace of Almighty Allah and the blessings of our families, we await your gracious presence to share in our joy.",
  musicPath: "/assets/music.mp3",
  maxPetals: 20,
  introDustCount: 14,
  events: [
    {
      kind: "nikah",
      title: "NIKAH",
      side: "right",
      datetime: "Sunday, 29th November 2026",
      datetimeSuffix: "at 11:30 AM",
      venueName: "Tennis Pavilion, Bangalore Palace",
      venueAddress: ["#1 / 21, Palace Road,", "Vasanth Nagar, Bengaluru – 560 006"],
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Tennis+Pavilion+Bangalore+Palace+Palace+Road+Bengaluru&query_place_id=ChIJ1USPfEQWrjsRNL4aJSJfWp4",
    },
    {
      kind: "valima",
      title: "VALIMA",
      side: "left",
      datetime: "Tuesday, 1st December 2026",
      datetimeSuffix: "Dinner, 8:00 PM onwards",
      venueName: "Palace Sheesh Mahal",
      venueAddress: ["Gate No. 7, Palace Grounds,", "Ballari Main Road, Near Mekeri Circle, Bengaluru"],
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Palace+Sheesh+Mahal+Palace+Grounds+Bengaluru&query_place_id=ChIJvWVinTUWrjsRmvmiJwVYNbg",
    },
  ] satisfies WeddingEvent[],
} as const;
