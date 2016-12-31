# flask_og

Flask server providing d3 app for oil/gas company visualizer


## Develop

Requires eve_og to be running locally.

See [eve_og](https://github.com/andrewmontes87/eve_og)


### Setup the virtualenv

Requires python 2.7 and virtualenv

```
$ virtualenv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

### Install node packages

Requires Node.js version 4 LTS

```
$ npm install
```

### Run the dev server

Run gulp to bundle to /static and watch /src for changes:

```
$ gulp
```

In a new terminal window start the flask server:

```
$ python run.py
```


## Deploy

Build with gulp and deploy to heroku:

```
$ gulp build
$ git push heroku master
```


