const Koa = require('Koa');
const Router = require('Koa-router');
const koaBody = require('koa-body');

const app = new Koa();
const router = new Router();

app.use(koaBody())

router.get('/', async (ctx, next) => {
  ctx.response.body = `<h1>index page</h1>`
})

router.post('/home', async (ctx, next) => {
  const req = ctx.request
  const res = ctx.response
  ctx.response.body = ctx
})

router.get('/404', async (ctx, next) => {
  ctx.response.body = '<h1>404 Not Found</h1>'
})

app.use(router.routes());

app.listen(3000);