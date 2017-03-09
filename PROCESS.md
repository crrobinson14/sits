# Setup Process / Steps Followed

Starting a new ActionHero project couldn't be easier. Let's start by
installing the command line tool

    npm install -g actionhero

which you only need to do once. And we'll also make a folder for our
project:

    mkdir thumbsvc
    cd thumbsvc
    actionhero generate
    npm install

Now, QuickTime screen recording takes a lot of CPU and really drags
down npm install. I'm going to pause the video to let npm complete
so we don't have to sit through this.





ActionHero isn't the only library we want for our project. I also installed
sequelize for data storage, with the sqlite plugin. That will let us
develop locally without worrying about database servers, but upgrade to
MySQL or Postgres later with just a config change.

I installed GraphicsMagick to process our images, Bluebird because even
though ES6 has native Promises I still occasionally use Bluebird's
extended features, and node-request for retrieving images from remote
servers. Fair warning, this last module, find-remove, is synchronous-only
and not actively maintained by its author. I'm using it to save time
in this video, but would not recommend it for a production service.

    npm install --save actionhero sequelize sqlite3 gm bluebird request find-remove
    npm install --save-dev chai dirty-chai

Finally, I also intalled chai and dirty chai, in dev-only, for unit testing.
This video will target Node 7.x and higher, which supports ecmascript 6.
However, ActionHero itself officially supports Node versions back to 4.x,
so you can absolutely use an older version if you prefer.

I've taken the time to set up my IDE for this project, so let's take a
look at its structure. As you can see, `actionhero generate` gave us
everything we need to get started, but only five of these folders are
really critical right now:

  actions are where we put our API call handlers
  config is where we adjust our server settings
  initializers is for our middleware, such as our database and image processing code
  tasks is where we'll put our scheduled cache cleanup code
  and finally tests is obviously where our tests go.

We want to start by stubbing out our API, and we could do this manually
in the actions folder. But ActionHero also lets us generate these from
the command line, so we could do it this way as well:

    actionhero generate action --name=createVariant
    actionhero generate action --name=apiKey
    actionhero generate action --name=db
    actionhero generate action --name=image
    actionhero generate action --name=tracking

So far so good.


    actionhero generate task --name=expireFiles --queue=default
    actionhero generate initializer --name=apiKey
    actionhero generate initializer --name=db
    actionhero generate initializer --name=image
    actionhero generate initializer --name=tracking

There are a few more useful commands we can run as well:

    actionhero actions list
    actionhero console
    actionhero tasks enqueue --name=XYZ --args=JSONARGS
