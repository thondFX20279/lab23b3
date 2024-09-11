export const notFound = (req, res, next) => {
  res.status(404).send({ msg: "Page not found" });
};
export const handleError = (error, req, res, next) => {
  console.log(error.message);
  const status = error.status || 500;
  res.status(status).send({ msg: error.message || "Internal server Error" });
};
