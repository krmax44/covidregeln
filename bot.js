const Twitter = require('twitter-lite');
const templates = require('./data/templates.json');
const laender = require('./data/laender.json');
const messwerte = require('./data/messwerte.json');
const gruppen = require('./data/gruppen.json');
const taetigkeiten = require('./data/taetigkeiten.json');
const orte = require('./data/orte.json');

const randomFromArray = a => a[Math.floor(Math.random() * a.length)];

const randomNumber = (min, max, decimalPlaces = 0) => {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
};

// range format: "1-1000" or "1.0-1.5"
const randomInRange = range => {
  const [, min, max] = /([\d\.]+)\-([\d\.]+)/.exec(range);
  const decimalPlaces = min.split('.')[1]?.length;
  return randomNumber(Number(min), Number(max), decimalPlaces);
};

const [messwert, range, unit] = randomFromArray(messwerte);
const status = randomFromArray(templates)
  .replace('$land', randomFromArray(laender))
  .replace('$messwert', messwert)
  .replace('$zahl', randomInRange(range) + unit)
  .replace('$gruppe', randomFromArray(gruppen))
  .replace('$ort', randomFromArray(orte))
  .replace('$taetigkeit', randomFromArray(taetigkeiten));

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

client.post('statuses/update', { status }).catch(e => {
  throw e;
});
