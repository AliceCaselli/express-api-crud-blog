// Bonus
// Nella rotta show, aggiungere al post una proprietà image_url dove creare il link completo per l’immagine
// Aggiungere un altra proprietà image_download_url che invece dovrà far scaricare l’immagine puntando alla rotta download
// Rendere navigabili i post nella index, stampando un link per la show di ciascuno

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const port = 8081;
// const postController = require("./controllers/posts");
const app = express();
const routerPost = require("./routers/posts");

// Configuriamo gli asset statici sull’applicazione in modo che si possano visualizzare le immagini associate ad ogni post.
app.use(express.static("public"));

// Creiamo il progetto base con una rotta / che ritorna un h1 con scritto Benvenuto nel mio blog!
app.get('/', (req, res) => {
    res.send("<h1>Benvenuti nel mio blog</h1>");
});

// Le rotte relative ai post dovranno chiamare la funzione relativa dal controller dedicato controllers/posts.js
app.use("/posts", routerPost);

app.listen(port, () => {
    console.log("http://localhost:" + port);
});




