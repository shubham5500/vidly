function error(req, res, error) {
    console.log({req, res, error});
  if (error.hasOwnProperty("message"))
    return res.status(400).send(error.message);
  return res.status(400).send(error);
}
module.exports.error = error;