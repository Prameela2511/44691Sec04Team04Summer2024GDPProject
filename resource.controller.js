const fs = require("fs");

const viewPdf = async (req, res, next) => {
  const stream = fs.createReadStream(
    `public/uploads/documents/${req.params.fileName}`
  );
  const fileName = req.params.fileName;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=${fileName}`);

  stream.pipe(res);
};

module.exports = {
  viewPdf,
};
