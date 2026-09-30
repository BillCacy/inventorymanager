import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { resolveDatabaseUrl } from "../src/lib/db-url";

config({ path: ".env.local" });

const adapter = new PrismaPg({
  connectionString: resolveDatabaseUrl(process.env.DATABASE_URL),
});
const prisma = new PrismaClient({ adapter });

// Catalog content (names, descriptions, prices, images, categories) lives in
// Sanity. Postgres only holds stock levels, keyed by the SKU used in Sanity.
const inventory = [
  { sku: "ACC-4001", stock: 33 }, // USB-C Hub (7-in-1)
  { sku: "ACC-4002", stock: 47 }, // Wireless Charging Pad
  { sku: "ACC-4003", stock: 2 }, // Laptop Sleeve (13-inch)
  { sku: "ACC-4004", stock: 29 }, // 10,000mAh Power Bank
  { sku: "AUD-1001", stock: 42 }, // Wireless Earbuds Pro
  { sku: "AUD-1002", stock: 17 }, // Over-Ear Studio Headphones
  { sku: "AUD-1003", stock: 0 }, // Portable Bluetooth Speaker
  { sku: "AUD-1004", stock: 25 }, // USB Condenser Microphone
  { sku: "CMP-5001", stock: 19 }, // Mechanical Keyboard
  { sku: "CMP-5002", stock: 24 }, // Wireless Ergonomic Mouse
  { sku: "CMP-5003", stock: 0 }, // 4K Webcam
  { sku: "SHM-3001", stock: 20 }, // Smart Thermostat
  { sku: "SHM-3002", stock: 4 }, // Video Doorbell
  { sku: "SHM-3003", stock: 60 }, // Smart LED Bulb (4-Pack)
  { sku: "SHM-3004", stock: 8 }, // Robot Vacuum
  { sku: "SHM-3005", stock: 55 }, // Smart Plug (2-Pack)
  { sku: "WEA-2001", stock: 38 }, // Fitness Tracker Band
  { sku: "WEA-2002", stock: 3 }, // Smartwatch Series X
  { sku: "WEA-2003", stock: 11 }, // Sleep Tracking Ring
  { sku: "WEA-2004", stock: 0 }, // Kids GPS Smartwatch
];

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({ data: inventory });

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

  console.log(`Seeded stock for ${inventory.length} products.`);
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
