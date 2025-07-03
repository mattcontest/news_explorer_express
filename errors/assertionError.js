class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 422;
  }
}

module.exports = AssertionError;
