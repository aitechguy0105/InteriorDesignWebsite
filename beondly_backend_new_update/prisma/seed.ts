import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

// initialize the Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  // create two dummy users
  const adminpass = await argon2.hash('admin123!');
  const testClientPass = await argon2.hash('user123!');

  const user1 = await prisma.user.upsert({
    where: { email: 'admin@visualee.com' },
    update: {
      password: adminpass,
    },
    create: {
      email: 'admin@visualee.com',
      name: 'Admin user',
      password: adminpass,
      role: 'admin',
      verifyemail: true,
      status: 'ACTIVE',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user@visualee.com' },
    update: {
      password: testClientPass,
    },
    create: {
      email: 'user@visualee.com',
      name: 'Test Client',
      password: testClientPass,
      role: 'client',
      phoneNumber: '(03) 1234-5678',
      verifyemail: true,
      status: 'ACTIVE',
    },
  });

  const price1 = await prisma.price.upsert({
    where: { priceName: 'price0' },
    update: {},
    create: {
      priceName: 'price0',
      price: 10,
      quantity: 1,
      unit: 'yen',
    },
  });

  const price2 = await prisma.price.upsert({
    where: { priceName: 'price2' },
    update: {},
    create: {
      priceName: 'price2',
      price: 20,
      quantity: 1,
      unit: 'yen',
    },
  });

  const plan1 = await prisma.plan.upsert({
    where: { name: 'plan1' },
    update: {},
    create: {
      name: 'plan1',
      planName: 'free',
      download: false,
      limit: 5,
      active: true,
    },
  });

  const plan2 = await prisma.plan.upsert({
    where: { name: 'plan2' },
    update: {},
    create: {
      name: 'plan2',
      planName: 'pro',
      download: false,
      limit: 50,
      active: true,
    },
  });

  // create two dummy articles
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {
      authorId: user1.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {
      authorId: user2.id,
    },
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
      authorId: user2.id,
    },
  });

  const post3 = await prisma.article.upsert({
    where: { title: 'Prisma Client Just Became a Lot More Flexible' },
    update: {},
    create: {
      title: 'Prisma Client Just Became a Lot More Flexible',
      body: 'Prisma Client extensions provide a powerful new way to add functionality to Prisma in a type-safe manner...',
      description:
        'This article will explore various ways you can use Prisma Client extensions to add custom functionality to Prisma Client..',
      published: true,
    },
  });

  const roomname1 = await prisma.roomName.upsert({
    where: { name: 'livingroom' },
    update: {},
    create: {
      name: 'livingroom',
      jpName: '居間',
      prompt: 'Living Room',
    },
  });

  const roomname2 = await prisma.roomName.upsert({
    where: { name: 'Bedroom' },
    update: {},
    create: {
      name: 'Bedroom',
      jpName: '寝室',
      prompt: 'Bedroom',
    },
  });

  const baseimage1 = await prisma.baseImage.upsert({
    where: { name: 'modern' },
    update: {},
    create: {
      name: 'modern',
      jpname: '近代的',
      prompt: 'modern style room design',
      url: 'https://getrestyle.s3.ap-northeast-1.amazonaws.com/images/baseimage/art-deco07a7.jpg',
    },
  });

  const baseimage2 = await prisma.baseImage.upsert({
    where: { name: 'minimalist' },
    update: {},
    create: {
      name: 'minimalist',
      jpname: 'シンプルな',
      prompt: 'minimalist style room design',
      url: 'https://getrestyle.s3.ap-northeast-1.amazonaws.com/images/baseimage/art-nouveau07a7.jpg',
    },
  });

  const uploadimage1 = await prisma.uploadImage.upsert({
    where: { name: 'uploadimage1' },
    update: {},
    create: {
      name: 'uploadimage1',
      url: 'https://getrestyle.s3.ap-northeast-1.amazonaws.com/images/baseimage/art-nouveau07a7.jpg',
      authorId: user1.id,
    },
  });

  const uploadimage2 = await prisma.uploadImage.upsert({
    where: { name: 'uploadimage2' },
    update: {},
    create: {
      name: 'uploadimage2',
      url: 'https://getrestyle.s3.ap-northeast-1.amazonaws.com/images/baseimage/art-deco07a7.jpg',
      authorId: user2.id,
    },
  });

  const generateimage1 = await prisma.generateImage.upsert({
    where: {
      name: '1682996885-02ffbd694ec146da0d1de0bbed43db10-6a617742352a713ebde969b4ffc8ee37-1',
    },
    update: {},
    create: {
      name: '1682996885-02ffbd694ec146da0d1de0bbed43db10-6a617742352a713ebde969b4ffc8ee37-1',
      prompt: 'interior modern design room',
      userId: 2,
      baseUrl:
        'https://getrestyle.s3.ap-northeast-1.amazonaws.com/images/baseimage/coastald86b.jpg',
      // baseimageId: 1,
      // roomstyleId: 1,
      url: 'https://getrestyle.s3.ap-northeast-1.amazonaws.com/images/generateimage/1682996885-02ffbd694ec146da0d1de0bbed43db10-6a617742352a713ebde969b4ffc8ee37-1.jpg',
      method: 'restyle',
    },
  });

  const generateimage2 = await prisma.generateImage.upsert({
    where: {
      name: '1682996886-d4efb07b44b0d59913cf65cbbfd4dd92-96efb75b46f774bbe556a61dce18144e-1',
    },
    update: {},
    create: {
      name: '1682996886-d4efb07b44b0d59913cf65cbbfd4dd92-96efb75b46f774bbe556a61dce18144e-1',
      prompt: 'modern design room',
      userId: 2,
      baseUrl:
        'https://getrestyle.s3.ap-northeast-1.amazonaws.com/images/baseimage/coastald86b.jpg',
      // baseimageId: 2,
      // roomstyleId: 2,
      url: 'https://getrestyle.s3.ap-northeast-1.amazonaws.com/images/generateimage/1682996886-d4efb07b44b0d59913cf65cbbfd4dd92-96efb75b46f774bbe556a61dce18144e-1.jpg',
      method: 'restyle',
    },
  });

  console.log({
    post1,
    post2,
    post3,
    user1,
    user2,
    baseimage1,
    baseimage2,
    generateimage1,
    generateimage2,
    roomname1,
    roomname2,
  });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });
