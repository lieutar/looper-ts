import * as url from 'url';
import * as path from 'path';
const here = path.dirname( url.fileURLToPath( import.meta.url ) );

import express from 'express';
const app = express()
const port = 3000

app.use(express.static(path.join(here , "../dist/pages")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
