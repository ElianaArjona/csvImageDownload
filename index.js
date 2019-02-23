    //Modules
const fs = require('fs'),
    request = require('request'),
    csvParser = require('csv-parse'),
    util = require('util');

    //Async function variable
const asyncRead = util.promisify(fs.readFile),
      asyncParser = util.promisify(csvParser);

    //Variable
const filename = './result.csv';

async function parser(filename = ''){
  // Read file and parse.
  // TODO: improve with the stream API.
  let file = await asyncRead(filename, {encoding: 'utf8'})
  let result = await asyncParser(file, {delimiter: ',', columns: true})
  // for each row that contain the url image
  result.map( async function(image){
    image['image_url'] = image.guid__rendered
    console.log(image.image_url)
    let finalResult = await pusher(image)
    console.log(finalResult)
    download(finalResult.url , __dirname + '/images/'+ finalResult.name, function(){
      console.log("done")
    })
    return finalResult
  })
}

async function pusher(imageObject){
  let data = {
    url : imageObject.image_url
  }
  data['name'] = imageObject.image_url.split('/')[7]
  return data
}


async function download(uri, filename, callback){
  await request.head(uri, async function(err, res, body){
    if(res.headers['content-type']){
      await console.log('content-type:', res.headers['content-type']);
      await console.log('content-length:', res.headers['content-length']);
      await request(uri)
      .pipe(fs.createWriteStream(filename))
      .on('close', callback)
    }   
  });
};


parser(filename)
  .then(() => {
    console.log('Success! Exiting...')
  })
  .catch(console.error)