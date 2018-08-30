const Koa = require('Koa');
const Router = require('Koa-router');
const koaBody = require('koa-body');
const mongoose = require('mongoose');
const cors = require('koa2-cors');

const app = new Koa();
app.use(cors())
const router = new Router();

const User = require('./src/user');

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
router.get('/api/getRecord', async (ctx, next) => {
  // const currentRecord = new Record();
  const result = await Record.find({}).limit(2);
  ctx.body = result
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
  const result = await new Promise((resolve, reject) => {
    currentRecord.save(async (err, currentRecord) => {
      if (err) {
        return reject(err);
      }
      ctx.body = 'success'
      resolve(currentRecord);
    })
  })
})
router.post('/api/signin', async (ctx, next) => {
  let result = {
    success: false,
    message: '用户不存在'
  }
  const {username, password} = ctx.request.body
  await User.findOne({
    username
  }, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      ctx.body = result;
    } else {
      if (password === user.password) {
        ctx.body = {
          success: true,
          message: '登录成功'
        }
      } else {
        ctx.body = {
          success: false,
          message: '登录失败'
        }
      }
    }
  })
})
router.post('/api/signup',  async (ctx, next) => {
  let result = {
    success: false,
    message: '注册失败'
  }
  const {username, password} = ctx.request.body
  console.log(username, password, ctx.request.body)
  const user = await User.findOne({
    username
  });
  console.log(user)
  if (!user) {
    const newUser = new User({
      username: username,
      password: password
    })
    const doc = await newUser.save();
    if (!doc.errors) {
      ctx.body = {
        success: true,
        message: '注册成功'
      }
    } else {
      ctx.body = result
    }
  } else {
    ctx.body = {
      success: false,
      message: '用户名已经存在'
    }
  }
})
// router.get('/404', async (ctx, next) => {
//   ctx.response.body = '<h1>404 Not Found</h1>'
// })

app.use(router.routes());

app.listen(3000);