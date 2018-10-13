const connect = require('connect');
const serverStatic = require('serve-static');

connect().use(serverStatic(__dirname)).listen(8080, () => {
  console.log('Listening on 8080...')
})