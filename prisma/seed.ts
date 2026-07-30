import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Audio", slug: "audio" },
  { name: "Wearables", slug: "wearables" },
  { name: "Smart Home", slug: "smart-home" },
  { name: "Accessories", slug: "accessories" },
  { name: "Computing", slug: "computing" },
];

function img(slug: string) {
  return `https://picsum.photos/seed/${slug}/600/600`;
}

const products = [
  // Audio
  {
    slug: "wireless-earbuds-pro",
    name: "Wireless Earbuds Pro",
    category: "audio",
    description:
      "Active noise-cancelling earbuds with 30-hour battery life and a compact charging case.",
    priceCents: 12999,
    sku: "AUD-1001",
    stock: 42,
  },
  {
    slug: "over-ear-studio-headphones",
    name: "Over-Ear Studio Headphones",
    category: "audio",
    description: "Studio-tuned over-ear headphones with plush memory-foam ear cushions.",
    priceCents: 18999,
    sku: "AUD-1002",
    stock: 17,
  },
  {
    slug: "portable-bluetooth-speaker",
    name: "Portable Bluetooth Speaker",
    category: "audio",
    description: "Rugged, water-resistant speaker with 12-hour playtime and rich bass.",
    priceCents: 7999,
    sku: "AUD-1003",
    stock: 0,
  },
  {
    slug: "usb-condenser-microphone",
    name: "USB Condenser Microphone",
    category: "audio",
    description: "Plug-and-play condenser mic for streaming, podcasting, and calls.",
    priceCents: 8999,
    sku: "AUD-1004",
    stock: 25,
  },
  // Wearables
  {
    slug: "fitness-tracker-band",
    name: "Fitness Tracker Band",
    category: "wearables",
    description: "Lightweight fitness band with heart-rate, sleep, and step tracking.",
    priceCents: 5999,
    sku: "WEA-2001",
    stock: 38,
  },
  {
    slug: "smartwatch-series-x",
    name: "Smartwatch Series X",
    category: "wearables",
    description: "AMOLED smartwatch with GPS, always-on display, and 5-day battery life.",
    priceCents: 24999,
    sku: "WEA-2002",
    stock: 3,
  },
  {
    slug: "sleep-tracking-ring",
    name: "Sleep Tracking Ring",
    category: "wearables",
    description: "Titanium smart ring that tracks sleep stages, readiness, and activity.",
    priceCents: 29999,
    sku: "WEA-2003",
    stock: 11,
  },
  {
    slug: "kids-gps-smartwatch",
    name: "Kids GPS Smartwatch",
    category: "wearables",
    description: "Parent-monitored smartwatch with GPS location and SOS calling.",
    priceCents: 6999,
    sku: "WEA-2004",
    stock: 0,
  },
  // Smart Home
  {
    slug: "smart-thermostat",
    name: "Smart Thermostat",
    category: "smart-home",
    description: "Learning thermostat that adapts to your schedule and saves energy.",
    priceCents: 14999,
    sku: "SHM-3001",
    stock: 20,
  },
  {
    slug: "video-doorbell",
    name: "Video Doorbell",
    category: "smart-home",
    description: "1080p video doorbell with motion alerts and two-way audio.",
    priceCents: 9999,
    sku: "SHM-3002",
    stock: 4,
  },
  {
    slug: "smart-led-bulb-4-pack",
    name: "Smart LED Bulb (4-Pack)",
    category: "smart-home",
    description: "Color-changing smart bulbs with voice assistant support.",
    priceCents: 4499,
    sku: "SHM-3003",
    stock: 60,
  },
  {
    slug: "robot-vacuum",
    name: "Robot Vacuum",
    category: "smart-home",
    description: "Self-emptying robot vacuum with smart mapping and app scheduling.",
    priceCents: 34999,
    sku: "SHM-3004",
    stock: 8,
  },
  {
    slug: "smart-plug-2-pack",
    name: "Smart Plug (2-Pack)",
    category: "smart-home",
    description: "Wi-Fi smart plugs for scheduling and remote control of any outlet.",
    priceCents: 2499,
    sku: "SHM-3005",
    stock: 55,
  },
  // Accessories
  {
    slug: "usb-c-hub-7-in-1",
    name: "USB-C Hub (7-in-1)",
    category: "accessories",
    description: "Compact hub with HDMI, USB-A, SD card, and 100W power delivery.",
    priceCents: 4999,
    sku: "ACC-4001",
    stock: 33,
  },
  {
    slug: "wireless-charging-pad",
    name: "Wireless Charging Pad",
    category: "accessories",
    description: "15W fast wireless charger compatible with all Qi-enabled devices.",
    priceCents: 2999,
    sku: "ACC-4002",
    stock: 47,
  },
  {
    slug: "laptop-sleeve-13-inch",
    name: "Laptop Sleeve (13-inch)",
    category: "accessories",
    description: "Padded, water-resistant sleeve with a slim profile.",
    priceCents: 1999,
    sku: "ACC-4003",
    stock: 2,
  },
  {
    slug: "10000mah-power-bank",
    name: "10,000mAh Power Bank",
    category: "accessories",
    description: "Slim power bank with dual USB-C ports for fast charging on the go.",
    priceCents: 3499,
    sku: "ACC-4004",
    stock: 29,
  },
  // Computing
  {
    slug: "mechanical-keyboard",
    name: "Mechanical Keyboard",
    category: "computing",
    description: "Hot-swappable mechanical keyboard with RGB backlighting.",
    priceCents: 8999,
    sku: "CMP-5001",
    stock: 19,
  },
  {
    slug: "wireless-ergonomic-mouse",
    name: "Wireless Ergonomic Mouse",
    category: "computing",
    description: "Vertical ergonomic mouse designed to reduce wrist strain.",
    priceCents: 3999,
    sku: "CMP-5002",
    stock: 24,
  },
  {
    slug: "4k-webcam",
    name: "4K Webcam",
    category: "computing",
    description: "Ultra HD webcam with auto-focus and a built-in privacy shutter.",
    priceCents: 7499,
    sku: "CMP-5003",
    stock: 0,
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    const created = await prisma.category.create({ data: category });
    categoryMap.set(category.slug, created.id);
  }

  for (const product of products) {
    const categoryId = categoryMap.get(product.category);
    if (!categoryId) throw new Error(`Unknown category ${product.category}`);

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceCents: product.priceCents,
        sku: product.sku,
        imageUrl: img(product.slug),
        stock: product.stock,
        categoryId,
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@nimbustech.demo";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "NimbusAdmin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      name: "NimbusTech Admin",
      passwordHash,
    },
  });

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
