# Simple Image Thumbnail Service (SITS)

Sigh. Another image thumbnail service. Really?

Yes, really. We've all been there: you have a new project. It has some
clever bits you can't wait to work on... but first there's this chat
feature to finish, and it needs to allow image sharing. Obviously you'll
need to thumbnail them so they download quickly and look good on all
devices, but that's easy, right?

Everybody needs thumbnails - surely SOMEBODY already Open Sourced
something for this. You do some Googling and poking around StackOverflow,
and find Thumbor. It looks perfect - scalable, fast, secure, and it can
slice and dice images hundreds of different ways. The sprint is looking
good so far!

Then you hit two walls. First, your lead architect wants to predefine
image "variants", the way Drupal does, because he did a Drupal project
once and liked that feature. Second, you discover that Thumbor doesn't
process 20% of your requests because of issues with Python being super
strict about certificate handling or PIL throwing `cannot identify
image file` when it encounters even slightly out-of-spec assets. A quick
browse through the open Issues list on Github convinces you that this
might not be a quick win after all.

Another day getting cozy with Google gives you a long list of other
projects and SaaS services... none of which are good choices for some
reason: cost, known bugs, features not matching your requirements, etc.
You half-heartedly consider just dropping Drupal into your stack solely
for its thumbnailing features, before finally deciding that if you can
buy into THAT kind of crazy, you may as well just write it yourself.

Sound familiar?

## Requirements

SITS was born from a story just like this one. Rather than trying to
be super generic (like Thumbor), it's very opinionated about how it
works, and was designed specifically to address these requirements:

* Transform operations are pre-defined as "variants". For example,
  "small_square" might be a 100x100 scale-and-crop, while "banner" might
  be a 1024px-max-width (preserving aspect ratio) that outputs
  a 90% quality JPEG.
* A simple API should be included for listing/updating variants, and
  getting/clearing statistics from each node.
* Do not plan for complex back-ends like S3 storage, database servers,
  or static-asset serving (front-ending with Nginx). This is an MVP.

The rationale behind a defined-variant system is that it's harder to DDoS
because clients are limited in what they can request. A common thumbnail-
server attack pattern is to rapidly request a 1x1 crop, then a 2x2 crop,
etc. until the server keels over. The standard solution is signed URLs,
but they're a lot more work to implement. Pre-defining variants provides
a middle ground.

It also makes maintenance much easier. If the designers come back and say
the banners load too slowly, and they want to try a 60% JPEG instead of
90%, no client-side changes are required. And finally, you can pre-create
variants ahead of time, if you know what sizes will be needed. This last
detail is another security layer, because it would allow us to thumbnail
ONLY those images we pre-approved, without allowing attackers to ask us
to thumbnail every image in Google Image Search!

Including an API is an obvious win, and the last point is really about
not trying to "polish the cannonball." We can iterate on those features
later. For now we just need something to support our REAL project.

## Tech Stack

We've decided to go with NodeJS based on internal skill sets and the
fact that most of our other projects are Node as well. We won't worry
about front-ending it with Nginx, as we usually do - we'll just stick
it behind a CDN for now to provide more caching and "hide our origin."
And for a database, we'll use Sequelize with SQLite because that gives
us persistent storage with almost no work, and when we're ready we can
just switch it to MySQL or Postgres.

That leaves the app internals to decide. And clearly, a framework would
give us a big running start. I chose ActionHero for this project for the
reasons listed here:

[How to Choose a NodeJS Framework](https://medium.com/@CodeAndBiscuits/how-to-choose-a-nodejs-framework-a8a44bf73ad4#.i9ooww31u)

ActionHero seems tailor-made to our needs. It's an opinionated NodeJS
framework that includes a lot of "lego blocks" that should let us build
this project quickly:

* It's cluster-aware, so we have Redis-backed cross-cluster coordination
mechanisms we can leverage when we need to scale the service.
* It provides the concepts of both actions (API calls) and tasks (which
we can use to clean up expired assets, among other things).
* Both actions and tasks can be extended with middleware, so if we do
decide to add URL signing or other features, it should be easy.
* Server endpoints can support connectivity via Web (HTTP), WebSocket,
etc. This is an advantage if we want to add more efficient client
protocols, or an admin UI.
* Capes are awesome.

## API and Workflow

For our requirements, we decided to go with a very simple CRUD pattern.
We've named each endpoint, but we'll also make them available via
REST-pattern URIs as well:

* *getVariants - List the variants currently defined.
* *getVariant - Get the details on a specific variant.
* *updateVariant - Update a variant's details.
* *deleteVariant - Remove a variant.
* getStatistics - Get a block of server thumbnail statistics.
* *deleteStatistics - Clear / reset the statistics.
* getImage - Thumbnail one specific image into one specific variant.
* *processImage - Thumbnail one specific image into one or more variants
to pre-cache it.

The calls marked with a [*] will require an API key to complete. For now,
we'll set the expected API key in a config file, but this could obviously
be made more generic in the future.

## Installation and Usage

SITS uses GraphicsMagick for image manipulations. Please make sure you
install the [prerequisites](https://github.com/aheckmann/gm#getting-started)
before you proceed.

After that a simple `npm install` followed by an `npm start` is enough
to start the basic server. By default, the server will run on port 8080,
which you can change either by editing config/servers/web.js or setting
PORT when starting the server:

    PORT=3000 npm start

You could then make an API call to create a simple scale-and-crop
variant with a JPEG export:

