const express = require("express");
const multer = require("multer");
const router = express.Router();
const postController = require("../controllers/posts");


router.get("/", postController.index);

router.get("/create", postController.create);

router.get("/:slug", postController.show);

router.get("/:slug/download", postController.download);

router.post("/", multer({ dest: "public/imgs/posts" }).single("image"), postController.store);

router.get("/:slug/image", postController.showImage);

router.delete("/:slug", postController.destroy)

module.exports = router;