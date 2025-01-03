import { oriHandler, treeRouter } from "@weborigami/origami";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = 3000;

// Load the tree of resources from an Origami file
const siteFilename = path.resolve(
  fileURLToPath(import.meta.url),
  "../site.ori"
);
const siteFile = await fs.readFile(siteFilename);
const site = await oriHandler.unpack(siteFile);

// Redirect routes ending with a slash to "index.html"
app.use((req, res, next) => {
  if (req.path.endsWith("/")) {
    res.redirect(`${req.path}index.html`);
  } else {
    next();
  }
});

// Use Origami as middleware to serve the tree of resources. This could also be
// used to handle a subdirectory of the site instead of the top level.
app.use(treeRouter(site));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
