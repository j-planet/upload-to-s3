#!/usr/bin/env bash

npm install --save
npm install -g --save forever react react-dom react-addons-pure-render-mixin classnames react-modal

meteor npm install

meteor add themeteorchef:bert
meteor add meteorhacks:picker
meteor add meteorhacks:npm

meteor remove insecure
meteor remove autopublish
