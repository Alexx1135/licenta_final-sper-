import sanityClient from '../src/libs/sanity';

async function checkAdminUser() {
  const email = 'admin@gmail.com';

  const existing = await sanityClient.fetch(
    '*[_type == "user" && email == $email][0]',
    { email }
  );
  
  if (existing) {
    console.log('Admin user found:');
    console.log('ID:', existing._id);
    console.log('Name:', existing.name);
    console.log('Email:', existing.email);
    console.log('Is Admin:', existing.isAdmin);
    console.log('Password hash starts with:', existing.password.substring(0, 20) + '...');
  } else {
    console.log('Admin user not found.');
  }
}

checkAdminUser().catch(console.error);
