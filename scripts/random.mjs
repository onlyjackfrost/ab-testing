import axios from "axios";

/**
 * provide some information to send events randomly
 */
const tests = [
  {
    name: "testA",
    prise: 100,
  },
  {
    name: "testB",
    prise: 200,
  },
  {
    name: "testC",
    prise: 300,
  },
  {
    name: "testD",
    prise: 400,
  },
];

async function sendRandomEvent(userCount) {
  const start = Date.now();
  const concurrent = 100;
  for (let i = 0; i < userCount; i+=concurrent) {
    const user = `user_${i}`;
    const test = tests[Math.floor(Math.random() * tests.length)];
    try {
      await Promise.all(Array.from({ length: concurrent }).map(() => axios.post(`http://localhost:3000/api/event`, {
        type: "price",
        userId: user,
        testId: test.name,
        properties: {
          price: test.prise,
            },
          })
        )
      );
    } catch (error) {
      console.error('Error sending event:', error);
    }
  }
  const end = Date.now();
  console.log(`Time taken: ${end - start} ms, ${userCount / (end - start) * 1000} users/s`);
}

sendRandomEvent(10000);
