# Join development

## 1. Pre-requests

1. A PC with [NodeJS](https://nodejs.org/) (at least v22.14.0) installed
2. [Rush.js](https://rushjs.io/) installed: `npm install -g @microsoft/rush`

## 2. Prepare develop environments

1. Clone this repository: `git clone https://github.com/MisaLiu/yascml.git` and `cd yascml`
2. Install dependencies: `rush update`

## 3. Build artifacts

1. Build development artifacts: `rush build`
2. Build production artifacts: `rush build:prod`
3. Grab all artifacts to `yascml/dist`: `rush extract`

# Packages definition

* [loader](packages/loader): The YASCML itself
* [manager](packages/manager): Graphical mod manager
* [api](packages/api): Provides ability to modify SugarCube game data
* [patcher](packages/patcher): SugarCube game/engine patching utilities, also provides CLI
* [docs-install](packages/docs-install): Online YASCML installer
* [types](packages/types): Types used in this repo
* [utils](packages/utils): Utilities used in this repo
* [scripts](packages/scripts): Scripts used in this repo
