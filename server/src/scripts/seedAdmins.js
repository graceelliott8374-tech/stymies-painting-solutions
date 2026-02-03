require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const Admin = require("../models/Admin");

async function run() {
  await connectDB();

  const admins = [
    {
      name: process.env.SEED_ADMIN_NAME || "Admin",
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
    },
  ].filter((a) => a.email && a.password);

  if (!admins.length) {
    console.log(
      "No SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD provided. Nothing to seed.",
    );
    process.exit(0);
  }

  for (const a of admins) {
    const email = a.email.toLowerCase().trim();
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log("Admin exists:", email);
      continue;
    }

    const passwordHash = await bcrypt.hash(a.password, 12);
    await Admin.create({ name: a.name, email, passwordHash, role: "admin" });
    console.log("Created admin:", email);
  }

  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
