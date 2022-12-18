var express = require('express');
var router = express.Router();

const Gtts = require('gtts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hear', function( req, res, next ) {
  // res.send( 'hear stuff' );
  const gtts = new Gtts("what is up this is just a test", "is");
	res.header( "Content-Disposition", 'attachment; filename="' + 'tts' + '.mp3"');
  gtts.stream().pipe(res);
});

router.get('/send_message', async function(req,res,next) {
  console.log( 'received message via GET' );
  if ( apiInitialized )
  {
    var options = {
      conversationId: req.query.conv_id,
      parentMessageId: req.query.message_id
    };
    var useOptions = (req.query.message_id && req.query.conv_id)
    const result = await api.sendMessage( req.query.message, useOptions ? options : undefined );
    console.log( result );
    res.send( result );
  }
  else
  {
    res.send({
      message: 'the api wasn\'t initialized'
    });
  }
});



var api;
var apiInitialized = false;

// initChatGPT();
initChatGPTFullBrowser();

async function initChatGPTFullBrowser() {
  const { ChatGPTAPIBrowser } = await import('chatgpt')

  api = new ChatGPTAPIBrowser({
    email: process.env.OPENAI_EMAIL,
    password: process.env.OPENAI_PASSWORD
  });

  await api.initSession();

  apiInitialized = true;
  console.log( "THE API HAS BEEN INITIALIZED" );
}

async function initChatGPT() {
  // To use ESM in CommonJS, you can use a dynamic import
  const { ChatGPTAPI, getOpenAIAuth } = await import('chatgpt')

  const openAIAuth = await getOpenAIAuth({
    email: process.env.OPENAI_EMAIL,
    password: process.env.OPENAI_PASSWORD
  })

  api = new ChatGPTAPI({ ...openAIAuth })
  await api.initSession()

  apiInitialized = true;

  console.log( "THE API HAS BEEN INITIALIZED" );
  // const result = await api.sendMessage('Hello World!')
  // console.log(result)
}

module.exports = router;
