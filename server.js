const express = require('express');
const mercator = require('@mapbox/sphericalmercator');
const app = express();
('use strict');

const merc = new mercator({
  size: 256,
});

const TILE_SIZE = 256;

const fs = require('fs');
const mapnik = require('mapnik');
const path = require('path');

mapnik.register_datasource(
  path.join(mapnik.settings.paths.input_plugins, 'shape.input')
);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

const admin0Style = './style-admin0.xml';
app.get('/admin0/:z/:x/:y', function (req, res) {
  let z = req.params.z,
    x = req.params.x,
    y = req.params.y.slice(0, -4);

  const map = new mapnik.Map(TILE_SIZE, TILE_SIZE);

  map.load(admin0Style, function (err, map) {
    if (err) {
      res.end(err.message);
    }
    let bbox = merc.bbox(x, y, z, false, '900913');
    map.extent = bbox;
    const im = new mapnik.Image(TILE_SIZE, TILE_SIZE);
    map.render(im, function (err, im) {
      if (err) {
        res.end(err.message);
      } else {
        im.encode('png', function (err, buffer) {
          if (err) {
            res.end(err.message);
          } else {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(buffer);
          }
        });
      }
    });
  });
  res.type('png');
});

const admin1Style = './style-admin1.xml';
app.get('/admin1/:z/:x/:y', function (req, res) {
  let z = req.params.z,
    x = req.params.x,
    y = req.params.y.slice(0, -4);

  const map = new mapnik.Map(TILE_SIZE, TILE_SIZE);

  map.load(admin1Style, function (err, map) {
    if (err) {
      res.end(err.message);
    }
    let bbox = merc.bbox(x, y, z, false, '900913');
    map.extent = bbox;

    const im = new mapnik.Image(TILE_SIZE, TILE_SIZE);
    map.render(im, function (err, im) {
      if (err) {
        res.end(err.message);
      } else {
        im.encode('png', function (err, buffer) {
          if (err) {
            res.end(err.message);
          } else {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(buffer);
          }
        });
      }
    });
  });
  res.type('png');
});

app.listen(process.env.PORT || 8888);

console.log('server listening on 8888');
