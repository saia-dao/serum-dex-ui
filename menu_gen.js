'use strict';

// A static server using Node and Express
const express = require('express');
const app = express();
const fs = require('fs');

// instead of older body-parser
app.use(express.json());

// make all the files in 'public' available on the Web
app.use(express.static('public'));

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

// -------------------------------------------------

const fetch = require('node-fetch');

const url = 'https://galaxy.staratlas.com/nfts';
const programId = '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin';

const tokenMints = [
  { name: 'POLIS', address: 'poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk' },
  { name: 'ATLAS', address: 'ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx' },
  { name: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  { name: 'PASS', address: '9iHQcYQR3qfqUh1HsTvRu2K1QZSCW3M6DXCY7HcwFGJn' },
];
const markets = [];

// fetchNFTs();

async function fetchNFTs() {
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      for (var i = 0; i < data.length; i++) {
        var tokenName = data[i].symbol;
        var tokenAddress = data[i].mint;
        var tokenMarketAddress = data[i].markets[0].id; // There can be multiple markets, change here in the future

        if (tokenName == 'FM-T3A') {
          if (data[i]._id == '6143e0ac92761eeee4bc18f8') tokenName = 'FM-T3ANI';
          else tokenName = 'FM-T3ATLAS';
        }

        tokenMints.push({
          name: tokenName,
          address: tokenAddress,
        });

        markets.push({
          address: tokenMarketAddress,
          deprecated: false,
          name: tokenName,
          programId: programId,
        });
      }
    });

  console.log(markets);

  var tokenMintsJson = JSON.stringify(tokenMints, null, 4);

  fs.writeFile('token-mints.json', tokenMintsJson, 'utf8', (err) => {
    if (err) {
      console.log(err);
    }
  });

  var marketsJson = JSON.stringify(markets, null, 4);

  fs.writeFile('markets.json', marketsJson, 'utf8', (err) => {
    if (err) {
      console.log(err);
    }
  });
}

// -------------------------------------------------

var submenus = `import { Menu } from 'antd';
import React from 'react';


export default function DynamicMenu() {
    return (
<>
`;

const set = (obj, path, val) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] || {}), obj);
  lastObj[lastKey] = val;
};

var submenuArray = {};

buildSubmenus();

async function buildSubmenus() {
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.map(function (nft) {
        var key =
          '' +
          nft.attributes.itemType +
          '.' +
          nft.attributes.class +
          '.' +
          nft.markets[0].id; // fix this "markets[0]" dependency
        var value = nft.name + ' | ' + nft.symbol;
        set(submenuArray, key, value);
      });
      console.log(submenuArray);
    });

  var subMenusJson = JSON.stringify(submenuArray, null, 4);

  fs.writeFile('submenus.json', subMenusJson, 'utf8', (err) => {
    if (err) {
      console.log(err);
    }
  });
}

console.log(submenus);

// -------------------------------------------------

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log(
    'The static server is listening on port ' + listener.address().port,
  );
});
