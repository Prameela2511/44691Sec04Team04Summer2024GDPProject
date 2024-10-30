const express = require("express");
const { viewPdf } = require("../controllers/resource.controller");

const router = express.Router();

router.get("/pdf/:fileName", viewPdf);

module.exports = router;
