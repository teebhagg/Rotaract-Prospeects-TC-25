import { auth } from "../src/lib/auth";

async function testLogin() {
  console.log("Testing login for admin@admin.com...");
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: "admin@admin.com",
        password: "Admin@123",
      },
    });
    console.log("Login successful! Session created.");
    console.log("Token:", result.token);
  } catch (error) {
    console.error("Login failed:", error);
  }
}

testLogin();
