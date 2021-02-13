// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { version } from 'package.json';

export default (req, res) => {
  res.status(200).send(version);
};
