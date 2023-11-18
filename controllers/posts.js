const posts = require("../db.js");
const path = require("path");

// Creiamo poi una rotta /posts che ritorni tramite content negotiation la lista dei post, da un array locale. Ritorniamo i dati sotto forma di json e html stampando una semplice ul.
function index(req, res) {

    // console.log("ciao da index start");
    res.format({
        html: () => {
            const html = ["<h1> Elenco posts </h1>"]

            html.push("<ul>");

            for (const post of posts) {
                html.push(
                    `<li>
                        <h2>${post.title}</h2>
                        <p>${post.content}</p>
                        <img src="/imgs/posts/${post.image}" alt="" style="width: 100px"
                        </li>`);
            }
            html.push("</ul>");

            res.send(html.join(""));
            // console.log("ciao da index");

        },

        json: () => {
            res.type("json").send({
                totalPosts: posts.length,
                list: posts
            });
        },

        default: () => {
            res.status(406).send("Error");
            // console.log("ciao da index default");

        }
    });
}

// /:slug - show: tramite il parametro dinamico che rappresenta lo slug del post, ritornerà un json con i dati del post
function show(req, res) {
    // console.log("ciao dalla show start");

    res.format({
        json: () => {
            const postSlug = req.params.slug;

            const post = posts.find((post) => post.slug == postSlug);

            if (!post) {
                res.status(404).send("Error");
                return;
            }

            res.json(post);
            // console.log("ciao dalla show");

        },

        default: () => {
            res.status(404).send("Error");
            // console.log("ciao dalla show default");

        }


    })

}

// /create - create: ritornerà un semplice html con un h1 con scritto Creazione nuovo post e nel caso venga richiesta una risposta diversa da html lancerà un errore 406
function create(req, res) {

    // console.log("ciao dalla create start");
    res.format({
        html: () => {
            const html = "<h1>Creazione nuovo post</h1>";

            res.send(html);
            // console.log("ciao dalla create");
        },

        default: () => {

            res.status(406).send("Error");
            // console.log("ciao dalla create default");

        }
    })
}

// /:slug/download - download: dovrà far scaricare l’immagine del post rappresentato dallo slug. Attenzione, se lo slug contiene il simbolo / la rotta non funzionerà. C’è qualche strumento che ci permette di codificare lo slug?
function download(req, res) {

    const postSlug = req.params.slug;
    const post = posts.find((post) => post.slug == postSlug);

    if (!post) {
        res.status(404).send("Error");
        return;
    }

    const imagePath = path.join(__dirname, "../public/imgs/posts", post.image);
    res.download(imagePath, post.image);
}









module.exports = {
    index,
    show,
    create,
    download,
}