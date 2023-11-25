const posts = require("../db.js");
const path = require("path");
const fs = require("fs");
const { kebabCase } = require("lodash");

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


// / [POST] - rotta store del crud che riceverà dei dati e creerà un nuovo post. Questa dovrà riceve i dati in formato application/x-www-urlencoded e dovrà ritornare un redirect nel caso di richiesta html, altrimenti di default il json dell’elemento appena creato

//registro il body-parser per "application/json"
//app.use(express.json());

//registro il body-parser per "application/x-www-form-urlencoded"
//app.use(express.urlencoded({extended:true}));
//app.post("/", (req,res) =>{
//dentro re.body troveremo sia i dati ricevuti in formato json che x-www-form-urlencoded
//console.log(req.body);
//})

function store(req, res) {

    console.log(req.body);
    //leggo il db che ho già importato in alto
    //aggiungo il post al db
    res.format({
        html: () => {
            res.redirect("/");
        },

        default: () => {
            posts.push({
                ...req.body,
                slug: kebabCase(req.body.title),
                updatedAt: new Date().toISOString(),
                image: req.file
            })
        },
    });

    //converto il db in json
    const json = JSON.stringify(posts, null, 2);

    //scrivo il json su file
    fs.writeFileSync(path.resolve(__dirname, "..", "db.js"), json);

    res.json(posts[posts.length - 1]);

}


function showImage(req, res) {
    const post = findOrFail(req, res);

    if (typeof post.image === "string") {
        const filePath = path.resolve(__dirname, "../public/imgs/posts", post.image);

        res.sendFile(filePath);

        return;
    }

    const filePath = path.resolve(__dirname, "..", post.image.path);

    res.append("Content-Type", post.image.mimetype);

    res.sendFile(filePath);

};


function destroy(req, res) {
    res.format({
        html: () => {
            res.redirect("/");
        },
        default: () => {
            const post = findOrFail(req, res);

            const postIndex = posts.findIndex((_post) => _post.slug == post.slug);

            posts.splice(postIndex, 1);

            if (post.image) {
                if (typeof post.image === "string") {
                    const filePath = path.resolve(
                        __dirname,
                        "..",
                        "public",
                        "imgs",
                        "posts",
                        post.image
                    );

                    fs.unlinkSync(filePath);
                } else {
                    const filePath = path.resolve(__dirname, "..", post.image.path);

                    fs.unlinkSync(filePath);
                }
            }
            const json = JSON.stringify(posts, null, 2);
            fs.writeFileSync(path.resolve(__dirname, "..", "db", "db.json"), json);

            res.send("Post eliminato");
        }
    })

};






function findOrFail(req, res) {

    const postSlug = req.params.slug;

    const post = posts.find((post) => post.slug == postSlug);

    if (!post) {
        res.status(404).send(`Post con slug ${postSlug} non trovato!`);
        return;
    }

    return post;
}



module.exports = {
    index,
    show,
    create,
    download,
    store,
    showImage,
}