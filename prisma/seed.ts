import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialPosts: Prisma.PostCreateInput[] = [
  {
    title: "My first post",
    body: "This is the body of my first post",
    author: {
      connectOrCreate: {
        create: {
          name: "John Doe",
          email: "john.doe@example.com",
        },
        where: {
          email: "john.doe@example.com",
        },
      },
    },
  },
];
const orders = [
  {
    userId: "U123",
    userDesk: "Trading",
    client: "Acme Corp",
    symbol: "AAPL",
    quantity: 100,
    price: 150.25,
    entity: "NY",
    account: "ACC001",
    dateTime: new Date("2023-06-15T10:30:00"),
  },
  {
    userId: "U456",
    userDesk: "Sales",
    client: "TechGiant",
    symbol: "GOOGL",
    quantity: 50,
    price: 2750.5,
    entity: "CA",
    account: "ACC002",
    dateTime: new Date("2023-06-15T11:15:00"),
  },
  {
    userId: "U789",
    userDesk: "Research",
    client: "InnoSys",
    symbol: "MSFT",
    quantity: 75,
    price: 310.75,
    entity: "WA",
    account: "ACC003",
    dateTime: new Date("2023-06-15T12:00:00"),
  },
  {
    userId: "U234",
    userDesk: "Trading",
    client: "EcoSol",
    symbol: "TSLA",
    quantity: 30,
    price: 680.0,
    entity: "TX",
    account: "ACC004",
    dateTime: new Date("2023-06-15T13:45:00"),
  },
  {
    userId: "U567",
    userDesk: "Sales",
    client: "MegaCorp",
    symbol: "AMZN",
    quantity: 25,
    price: 3400.25,
    entity: "OR",
    account: "ACC005",
    dateTime: new Date("2023-06-15T14:30:00"),
  },
  {
    userId: "U890",
    userDesk: "Trading",
    client: "FinTech Ltd",
    symbol: "FB",
    quantity: 200,
    price: 330.5,
    entity: "CA",
    account: "ACC006",
    dateTime: new Date("2023-06-15T15:00:00"),
  },
  {
    userId: "U321",
    userDesk: "Research",
    client: "GreenEnergy",
    symbol: "NFLX",
    quantity: 40,
    price: 550.75,
    entity: "IL",
    account: "ACC007",
    dateTime: new Date("2023-06-15T15:30:00"),
  },
  {
    userId: "U654",
    userDesk: "Sales",
    client: "AutoMotive",
    symbol: "TSLA",
    quantity: 15,
    price: 695.0,
    entity: "MI",
    account: "ACC008",
    dateTime: new Date("2023-06-15T16:00:00"),
  },
  {
    userId: "U987",
    userDesk: "Trading",
    client: "PharmaCo",
    symbol: "PFE",
    quantity: 300,
    price: 45.75,
    entity: "NJ",
    account: "ACC009",
    dateTime: new Date("2023-06-15T16:30:00"),
  },
  {
    userId: "U210",
    userDesk: "Research",
    client: "TechStart",
    symbol: "NVDA",
    quantity: 60,
    price: 420.25,
    entity: "CA",
    account: "ACC010",
    dateTime: new Date("2023-06-15T17:00:00"),
  },
  {
    userId: "U543",
    userDesk: "Sales",
    client: "RetailGiant",
    symbol: "WMT",
    quantity: 150,
    price: 140.5,
    entity: "AR",
    account: "ACC011",
    dateTime: new Date("2023-06-16T09:30:00"),
  },
  {
    userId: "U876",
    userDesk: "Trading",
    client: "OilCorp",
    symbol: "XOM",
    quantity: 100,
    price: 60.25,
    entity: "TX",
    account: "ACC012",
    dateTime: new Date("2023-06-16T10:00:00"),
  },
  {
    userId: "U109",
    userDesk: "Research",
    client: "BioTech",
    symbol: "MRNA",
    quantity: 50,
    price: 180.75,
    entity: "MA",
    account: "ACC013",
    dateTime: new Date("2023-06-16T10:30:00"),
  },
  {
    userId: "U432",
    userDesk: "Sales",
    client: "CloudServ",
    symbol: "AMZN",
    quantity: 30,
    price: 3450.0,
    entity: "WA",
    account: "ACC014",
    dateTime: new Date("2023-06-16T11:00:00"),
  },
  {
    userId: "U765",
    userDesk: "Trading",
    client: "MediaGroup",
    symbol: "DIS",
    quantity: 80,
    price: 175.5,
    entity: "CA",
    account: "ACC015",
    dateTime: new Date("2023-06-16T11:30:00"),
  },
];
async function main() {
  console.log("Seeding database...");
  for (const post of initialPosts) {
    const newPost = await prisma.post.create({
      data: post,
    });
    console.log(`Created post with id: ${newPost.id}`);
  }
  console.log("Database seeded successfully");

  for (const order of orders) {
    await prisma.order.create({
      data: order,
    });
  }
}

main()
  .then(() => {
    prisma.$disconnect();
    console.log("Seeding completed");
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
  });
