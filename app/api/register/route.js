import bcryptjs from "bcryptjs";
import connectDB from "@/config/database";
import User from "@/models/User";

export const POST = async (request) => {
  await connectDB();
  const { data } = await request.json();
  const { username, email, password } = data;
  console.log(username, email, password);

  if (!username || !email || !password) {
    return new Response("Missing name, email or password", { status: 400 });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return new Response("User already exists", { status: 400 });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });

  return new Response(JSON.stringify(user), { status: 200 });
};
