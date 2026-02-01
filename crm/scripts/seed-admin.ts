import { auth } from "../src/lib/auth";
import { prisma } from "@/lib/prisma";

async function seed() {
  console.log("Seeding admin user...");
  try {
    const adminEmail = "admin@admin.com";
    const adminPassword = "Admin@123";
    const adminName = "Admin User";

    const user = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
      },
    });

    // Create a user record in the database
    const userRecord = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
      },
    });

    if (!user || !userRecord) {
      throw new Error("Failed to create admin user");
    }

    console.log("Admin user created successfully:", userRecord);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

seed();
