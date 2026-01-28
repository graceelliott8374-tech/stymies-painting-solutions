require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const Admin = require("../models/Admin");

async function run() {
  await connectDB();

  const admins = [
    { name: "Grace", email: "grace@example.com", password: "ChangeMeGrace!" },
    { name: "Bryan", email: "bryan@example.com", password: "ChangeMeBryan!" },
  ];

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
