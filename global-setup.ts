import { createStaticServer } from './test/static';

module.exports = async function globalSetup() {
  const staticServerPort = 7878;
  return new Promise(async (resolve) => {
    const server = await createStaticServer(staticServerPort);
    await server.start();
    global.__STATIC_SERVER__ = server;
    resolve(true);
  });
}