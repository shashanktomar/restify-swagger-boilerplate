export const ping = (req, res, next) => {
  res.send('pong');
  return next();
};
