import sanityClient from '../src/libs/sanity';
import bcrypt from 'bcryptjs';

async function updateAdminPassword() {
  const email = 'admin@gmail.com';
  const newPassword = 'admin123';

  // Find the admin user
  const adminUser = await sanityClient.fetch(
    '*[_type == "user" && email == $email][0]',
    { email }
  );

  if (!adminUser) {
    console.log('Admin user not found.');
    return;
  }

  console.log('Found admin user:', adminUser._id);

  // Hash the password with bcrypt
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update the user's password
  const result = await sanityClient
    .patch(adminUser._id)
    .set({ password: hashedPassword })
    .commit();

  console.log('Admin password updated with bcrypt hash:', result._id);
  console.log('New password hash starts with:', hashedPassword.substring(0, 20) + '...');
}

updateAdminPassword().catch(console.error);
