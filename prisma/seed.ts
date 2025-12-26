import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Sample Sydney suburbs with realistic data
  const suburbsData = [
    {
      name: "Parramatta",
      postcode: "2150",
      latitude: -33.8151,
      longitude: 151.0017,
      medianPrice: 850000,
      priceGrowth12m: 8.5,
      rentalYield: 3.2,
      investmentScore: 85,
      populationSize: 30211,
      averageIncome: 68000,
      pointsOfInterest: [
        {
          name: "Parramatta Station",
          type: "transport",
          address: "Parramatta NSW 2150",
          latitude: -33.8171,
          longitude: 151.0043,
          rating: 4.2,
          metadata: { transportType: "train", lines: ["T1", "T2", "T5"] },
        },
        {
          name: "Westfield Parramatta",
          type: "shopping",
          address: "159-175 Church St, Parramatta NSW 2150",
          latitude: -33.8156,
          longitude: 151.0041,
          rating: 4.3,
          metadata: { mallSize: "large", stores: 460 },
        },
        {
          name: "Arthur Phillip High School",
          type: "school",
          address: "2 Murray Farm Rd, Parramatta NSW 2150",
          latitude: -33.8089,
          longitude: 150.9989,
          rating: 4.0,
          metadata: { type: "public", years: "7-12", students: 1200 },
        },
        {
          name: "Parramatta Park",
          type: "park",
          address: "Pitt St & Macquarie St, Parramatta NSW 2150",
          latitude: -33.8098,
          longitude: 151.0089,
          rating: 4.7,
          metadata: { size: "85 hectares", facilities: ["playground", "sports", "bbq"] },
        },
      ],
    },
    {
      name: "Chatswood",
      postcode: "2067",
      latitude: -33.7969,
      longitude: 151.1817,
      medianPrice: 1250000,
      priceGrowth12m: 12.3,
      rentalYield: 2.8,
      investmentScore: 92,
      populationSize: 26500,
      averageIncome: 95000,
      pointsOfInterest: [
        {
          name: "Chatswood Station",
          type: "transport",
          address: "Victoria Ave, Chatswood NSW 2067",
          latitude: -33.7968,
          longitude: 151.1833,
          rating: 4.5,
          metadata: { transportType: "train", lines: ["T1", "T9"] },
        },
        {
          name: "Chatswood Chase",
          type: "shopping",
          address: "345 Victoria Ave, Chatswood NSW 2067",
          latitude: -33.7965,
          longitude: 151.1829,
          rating: 4.4,
          metadata: { mallSize: "medium", stores: 180 },
        },
        {
          name: "Chatswood High School",
          type: "school",
          address: "37 Centennial Ave, Chatswood NSW 2067",
          latitude: -33.7891,
          longitude: 151.1789,
          rating: 4.5,
          metadata: { type: "public", years: "7-12", students: 1450 },
        },
      ],
    },
    {
      name: "Bondi",
      postcode: "2026",
      latitude: -33.8915,
      longitude: 151.2767,
      medianPrice: 1850000,
      priceGrowth12m: 6.2,
      rentalYield: 2.5,
      investmentScore: 78,
      populationSize: 11520,
      averageIncome: 110000,
      pointsOfInterest: [
        {
          name: "Bondi Beach",
          type: "park",
          address: "Queen Elizabeth Dr, Bondi Beach NSW 2026",
          latitude: -33.8908,
          longitude: 151.2743,
          rating: 5.0,
          metadata: { type: "beach", facilities: ["swimming", "surfing", "cafes"] },
        },
        {
          name: "Bondi Junction Station",
          type: "transport",
          address: "Grafton St, Bondi Junction NSW 2022",
          latitude: -33.8931,
          longitude: 151.2479,
          rating: 4.3,
          metadata: { transportType: "train", lines: ["T4"] },
        },
        {
          name: "Westfield Bondi Junction",
          type: "shopping",
          address: "500 Oxford St, Bondi Junction NSW 2022",
          latitude: -33.8930,
          longitude: 151.2496,
          rating: 4.5,
          metadata: { mallSize: "large", stores: 400 },
        },
      ],
    },
    {
      name: "Penrith",
      postcode: "2750",
      latitude: -33.7510,
      longitude: 150.6940,
      medianPrice: 720000,
      priceGrowth12m: 15.8,
      rentalYield: 3.8,
      investmentScore: 88,
      populationSize: 15311,
      averageIncome: 62000,
      pointsOfInterest: [
        {
          name: "Penrith Station",
          type: "transport",
          address: "Station St, Penrith NSW 2750",
          latitude: -33.7512,
          longitude: 150.6955,
          rating: 4.0,
          metadata: { transportType: "train", lines: ["T1", "T5"] },
        },
        {
          name: "Westfield Penrith",
          type: "shopping",
          address: "585 High St, Penrith NSW 2750",
          latitude: -33.7534,
          longitude: 150.6968,
          rating: 4.2,
          metadata: { mallSize: "large", stores: 280 },
        },
        {
          name: "Penrith High School",
          type: "school",
          address: "Woodriff St, Penrith NSW 2750",
          latitude: -33.7489,
          longitude: 150.6912,
          rating: 3.9,
          metadata: { type: "public", years: "7-12", students: 950 },
        },
      ],
    },
    {
      name: "Ryde",
      postcode: "2112",
      latitude: -33.8155,
      longitude: 151.1021,
      medianPrice: 1100000,
      priceGrowth12m: 10.2,
      rentalYield: 3.0,
      investmentScore: 86,
      populationSize: 23700,
      averageIncome: 78000,
      pointsOfInterest: [
        {
          name: "Ryde Station",
          type: "transport",
          address: "Blaxland Rd, Ryde NSW 2112",
          latitude: -33.8168,
          longitude: 151.1039,
          rating: 4.1,
          metadata: { transportType: "train", lines: ["T9"] },
        },
        {
          name: "Top Ryde City",
          type: "shopping",
          address: "109 Blaxland Rd, Ryde NSW 2112",
          latitude: -33.8145,
          longitude: 151.1029,
          rating: 4.3,
          metadata: { mallSize: "large", stores: 220 },
        },
        {
          name: "Ryde Secondary College",
          type: "school",
          address: "613 Victoria Rd, Ryde NSW 2112",
          latitude: -33.8089,
          longitude: 151.1067,
          rating: 4.3,
          metadata: { type: "public", years: "7-12", students: 1100 },
        },
      ],
    },
    {
      name: "Hurstville",
      postcode: "2220",
      latitude: -33.9676,
      longitude: 151.1021,
      medianPrice: 920000,
      priceGrowth12m: 9.5,
      rentalYield: 3.3,
      investmentScore: 82,
      populationSize: 28000,
      averageIncome: 72000,
      pointsOfInterest: [
        {
          name: "Hurstville Station",
          type: "transport",
          address: "Forest Rd, Hurstville NSW 2220",
          latitude: -33.9685,
          longitude: 151.1033,
          rating: 4.2,
          metadata: { transportType: "train", lines: ["T4", "T8"] },
        },
        {
          name: "Westfield Hurstville",
          type: "shopping",
          address: "Park Rd & Cross St, Hurstville NSW 2220",
          latitude: -33.9682,
          longitude: 151.1023,
          rating: 4.1,
          metadata: { mallSize: "medium", stores: 190 },
        },
        {
          name: "Hurstville Public School",
          type: "school",
          address: "Forest Rd, Hurstville NSW 2220",
          latitude: -33.9698,
          longitude: 151.1045,
          rating: 4.2,
          metadata: { type: "public", years: "K-6", students: 680 },
        },
      ],
    },
    {
      name: "Strathfield",
      postcode: "2135",
      latitude: -33.8760,
      longitude: 151.0850,
      medianPrice: 1480000,
      priceGrowth12m: 7.8,
      rentalYield: 2.6,
      investmentScore: 79,
      populationSize: 21000,
      averageIncome: 88000,
      pointsOfInterest: [
        {
          name: "Strathfield Station",
          type: "transport",
          address: "The Boulevarde, Strathfield NSW 2135",
          latitude: -33.8765,
          longitude: 151.0855,
          rating: 4.4,
          metadata: { transportType: "train", lines: ["T2", "T3", "T9"] },
        },
        {
          name: "Strathfield Plaza",
          type: "shopping",
          address: "11 The Boulevarde, Strathfield NSW 2135",
          latitude: -33.8768,
          longitude: 151.0862,
          rating: 4.0,
          metadata: { mallSize: "small", stores: 85 },
        },
        {
          name: "Strathfield Girls High School",
          type: "school",
          address: "Albert Rd, Strathfield NSW 2135",
          latitude: -33.8789,
          longitude: 151.0878,
          rating: 4.6,
          metadata: { type: "public", years: "7-12", students: 1250 },
        },
      ],
    },
    {
      name: "Liverpool",
      postcode: "2170",
      latitude: -33.9213,
      longitude: 150.9228,
      medianPrice: 750000,
      priceGrowth12m: 14.2,
      rentalYield: 3.9,
      investmentScore: 90,
      populationSize: 28200,
      averageIncome: 65000,
      pointsOfInterest: [
        {
          name: "Liverpool Station",
          type: "transport",
          address: "Railway St, Liverpool NSW 2170",
          latitude: -33.9217,
          longitude: 150.9234,
          rating: 4.1,
          metadata: { transportType: "train", lines: ["T2", "T3", "T5"] },
        },
        {
          name: "Westfield Liverpool",
          type: "shopping",
          address: "Macquarie St, Liverpool NSW 2170",
          latitude: -33.9225,
          longitude: 150.9241,
          rating: 4.2,
          metadata: { mallSize: "large", stores: 315 },
        },
        {
          name: "Liverpool Hospital",
          type: "medical",
          address: "Elizabeth St, Liverpool NSW 2170",
          latitude: -33.9198,
          longitude: 150.9289,
          rating: 3.8,
          metadata: { type: "public", services: ["emergency", "surgery", "maternity"] },
        },
      ],
    },
  ];

  // Create suburbs with POIs
  for (const suburbData of suburbsData) {
    const { pointsOfInterest, ...suburbInfo } = suburbData;

    console.log(`Creating suburb: ${suburbInfo.name}`);

    await prisma.suburb.upsert({
      where: { name: suburbInfo.name },
      update: {},
      create: {
        ...suburbInfo,
        pointsOfInterest: {
          create: pointsOfInterest,
        },
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

