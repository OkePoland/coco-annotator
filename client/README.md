# Multi Annotator Client

React App based on [coco-annotator][df1] project with use of
 - Yarn workspaces
 - Lerna
 - Typescript
 - Paper.js

### Packages
  - `@multi-annotator\core` - library for shared components, methods and utils
  - `@multi-annotator\annotator` - library with tool for annotating ( use Paper.js )
  - `@multi-annotator\clientApp` - React app which use core & annotator libraries
---
### Installation

##### Development ( React Scripts )
Dev server use proxy configuration for images defined in:
> packages/clientapp/packages.json  ("proxy": "http://localhost:5000")

In order to run project
```sh
yarn add lerna ## ( if not installed ) ##
yarn bootstrap
yarn start
```

##### Production ( Docker )
Production build use nginx for optimization purposes
Production server use proxy configuration for images defined in:
> nginx.conf

Dokcerfile contains following steps:
- `Build step`
   - Install lerna + yarn
    - Copy files
    - Install packages + bootstrap them via lerna
    - Comile typescript in `@multi-annotator/core` , `@multi-annotator/annotator` 
    - Build production package for `@multi-annotator/clientapp` ( use core && annotator compiled code )
    - Compiled App files are now inside packages/clientapp/build folder
- `Serve step`
    - Copy packages/clientapp/build content into nginx folder
    - Run nginx server

In order to build project
```sh
docker-compose -p multi-annotator-react -f docker-compose.dev.yml up --build
```
---
### Available Scripts

In the project directory, you can run:

##### `yarn bootstrap`
- Run lerna bootstrap  
Bootstrap the packages in the current Lerna repo. 
Installs all of their dependencies and links any cross-dependencies.

##### `yarn start`
- Compile libraries (in watch mode) + start React development server

##### `yarn build`
- Compile all packages (in dependency order thanks to --stream option)

##### `clear_libs`
- Remove `dist` and `build` folders from packages

##### `clear`
- Run `clear_libs` ant then remove `node_modules` from every packages 
( After this command another `yarn bootstrap` will be required )

---
#### Credits
Special credits to:
- `W.B.` for React support
- `Count A.G.` for help with Docker && nginx configuration

[df1]: <https://github.com/jsbroks/coco-annotator>
