
module.exports = async function globalTeardown() {
  global.__STATIC_SERVER__?.stop();
  return true;
}