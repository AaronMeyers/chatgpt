var express = require('express');
var router = express.Router();

const Gtts = require('gtts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'test chatgpt' });
});

router.get('/hear', function( req, res, next ) {
  // res.send( 'hear stuff' );
  const gtts = new Gtts("what is up this is just a test", "is");
	res.header( "Content-Disposition", 'attachment; filename="' + 'tts' + '.mp3"');
  gtts.stream().pipe(res);
});

router.post('/send_message', async function(req,res,next) {
  // console.log( 'received message via GET' );
  console.log( 'received message via POST' );
  console.log( 'message: ' + req.body['message'] );
  if ( apiInitialized )
  {
    var options = {
      conversationId: req.body['conversationId'],
      parentMessageId: req.body['parentMessageId']
    };

    console.log( options );
    var useOptions = (req.body['conversationId'] != null && req.body['parentMessageId'] != null)
    
    console.log( 'useOptions: ' + useOptions );
    if ( useOptions )
    {
      console.log( options );
    }
    
    try{
      const result = await api.sendMessage( req.body['message'], useOptions ? options : undefined );
      console.log( result );
      res.send( result );
    }
    catch ( error )
    {
      console.log( 'there was an error' );
      res.send({
        response: 'there was an error :(',
        error: error
      });
      return;
    }
  }
  else
  {
    res.send({
      response: 'the api wasn\'t initialized'
    });
  }
});



var api;
var apiInitialized = false;

// initChatGPT();
initChatGPTFullBrowser();

// init();

async function init()
{
  const { ChatGPTAPI } = await import( 'chatgpt' )

  console.log( 'token: ' + process.env.SESSION_TOKEN )
  api = new ChatGPTAPI({ sessionToken: process.env.SESSION_TOKEN } )
  await api.ensureAuth()

  apiInitialized = true;
  console.log( "THE API HAS BEEN INITIALIZED" );
}

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
