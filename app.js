// Per il nostro blog, concentriamoci sul creare 2 rotte:

// /:slug [DELETE] - rotta destroy del crud che dovrà ritornare un 404 nel caso non sia stato trovato un post corrispondente. Ritornare un redirect nel caso di richiesta html, altrimenti di default del testo con scritto “post eliminato”
// Tutte le funzioni delle rotte dovranno essere scritte nel controller dedicato.
// Testare le rotte tramite Postman.
// Bonus
// Tramite una funzione, salvare l’array dei post nel file .json
// nella funzione store permettere di passare i dati nel formato multipart/form-data tramite multer
// permettere di eseguire l’upload dell’immagine principale del post.



const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const port = 8081;
// const postController = require("./controllers/posts");
const app = express();
const routerPost = require("./routers/posts");

//configuro express per leggere i dati in formato json
app.use(express.json());

//configuro express per leggere i dati in formato x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

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




