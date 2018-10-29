# Front-end for Docs

Uses Gatsby to build static site. 

Installation:

```
npm install
```

Running locally:

```
STITCH_ID=<STITCH_ID> NAMESPACE=<DB/COLLECTION> PREFIX=<SITE/USER/BRANCH> gatsby develop
then go to http://localhost:8000 
```

To build and serve the site, use the same ENV vars from above:

```
ENV_VARS gatsby build --prefix-paths
gatsby serve
```

