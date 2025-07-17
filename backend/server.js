import express from "express";
const app = express();

// app.get("/", (req, res) => {
//   res.send("Server is ready");
// });

// get a list of 5 jokes
app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "NoSQL bar",
      content:
        "Three SQL Database Admins walked into a NoSQL bar. A little while later they walked out because they couldn’t find a table.",
    },
    {
      id: 2,
      title: "UDP joke",
      content:
        "I’d tell them a UDP joke but there’s no guarantee that they would get it.",
    },
    {
      id: 3,
      title: "Off byte",
      content:
        "Two bytes meet. The first byte asks, “Are you ill?” The second byte replies, “No, just feeling a bit off.”",
    },
    {
      id: 4,
      title: "IP address love",
      content:
        "Man to a Software Engineer: “When do you think it’s love?” Reply: “It’s love when you memorise her IP address to skip the DNS overhead.”",
    },
    {
      id: 5,
      title: "Halloween vs Christmas",
      content:
        "Why do programmers always mix up Halloween and Christmas? Because Oct 31 equals Dec 25.",
    },
  ];
  res.send(jokes);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
