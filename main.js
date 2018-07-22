const Koa = require('Koa');
const Router = require('Koa-router');
const koaBody = require('koa-body');
const mongoose = require('mongoose');

const app = new Koa();
const router = new Router();

mongoose.connect('mongodb://127.0.0.1:27017/account', { useNewUrlParser: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connect error:'));
// db.once('open', function() {
//   console.log('db connect success')
// })

var recordSchema = mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  spendAt: Date,
  version: Number,
  cost: Number,
  tag: String,
  detail: String
});

var Record = mongoose.model('Record', recordSchema);

app.use(koaBody())

router.get('/', async (ctx, next) => {
  ctx.response.body = `<h1>index page</h1>`
})

router.post('/api/addRecord', async (ctx, next) => {
  const requestBody = ctx.request.body
  const currentRecord = new Record();
  currentRecord.createdAt = new Date();
  currentRecord.spendAt = requestBody.spendAt;
  currentRecord.version = 1;
  currentRecord.cost = requestBody.cost;
  currentRecord.tag = requestBody.tag;
  currentRecord.detail = requestBody.detail;
  const result = await currentRecord.save(async (err, currentRecord) => {
    if (err) {
      console.log(err)
    } else {
      ctx.status = 200;
      ctx.response.body = 'save success!'
      console.log(currentRecord)
      console.log(ctx)
    }
  })
})

router.get('/404', async (ctx, next) => {
  ctx.response.body = '<h1>404 Not Found</h1>'
})

app.use(router.routes());

app.listen(3000);