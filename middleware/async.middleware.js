module.exports = function asyncMiddleware(handler) {
  return async (...args) => {
    try {
      await handler(...args);
    } catch (error) {
      next(error);
    }
  };
};
