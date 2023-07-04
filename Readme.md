To deploy:
- clone repo
- switch to **task3** branch
- run npm install

To run:
- linter - **npm run lint**

- silent test - **npm run test**
- verbose test - **npm run test:verbose**

- single server, dev mode - **npm run start:dev**
- single server, prod mode - **npm run start:prod**
- single server, build - **npm run build**

- multi server, dev mode - **npm run start:multi**
- multi server, prod mode - **npm run start:multi:prod**
- multi server, build - **npm run build:multi**

- build all - **npm run build:all**

If you want to change the default server port (4000) create a .env file at the root with the desired value according to the example from the .env.example file 

**Attention - It is not necessary to run the server before running the tests - it is done automatically**
