import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_ADMIN_EMAIL = "admin@poms.com";
const DEFAULT_ADMIN_PASSWORD = "Admin@123";
const DEFAULT_ADMIN_NAME = "Super Admin";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? DEFAULT_ADMIN_NAME;

  if (!password || password.length < 8) {
    throw new Error("Admin seed password must be at least 8 characters long.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      email,
      name,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log("Seeded admin user:", {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error("Failed to seed admin user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
