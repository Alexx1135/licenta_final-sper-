import sanityClient from '../src/libs/sanity';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  const email = 'admin@gmail.com';
  const name = 'admin';
  const password = 'admin123';
  const isAdmin = true;

  // Check if admin already exists
  const existing = await sanityClient.fetch(
    '*[_type == "user" && email == $email][0]',
    { email }
  );
  if (existing) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = {
    _type: 'user',
    name,
    email,
    password: hashedPassword, // store as bcrypt hash for consistent authentication
    isAdmin,
    about: 'Default admin user',
    image: '',
  };

  const result = await sanityClient.create(user);
  console.log('Admin user created:', result);
}

createAdminUser().catch(console.error);
