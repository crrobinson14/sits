# Simple Image Thumbnail Service (SITS)

SITS is an example of using the ActionHero framework to build a thumbnail
generation service. However, it is not a sample project - it is a fully
functional application that addresses the unique needs of one of this
author's projects. In particular, the requirements were for a micro-
service that was:

* Variant-based,
* Self-hosted, and
* Easily "primed" to avoid slow accesses for the first users retrieving
a new asset.

Prior to developing SITS, this author was using Thumbor, and that
project remains very useful today. However, it depends on the PIL, which
has issues with some low-quality sources, particularly those with dodgy
SSL certificates and/or out-of-spec images. One might argue that those
assets should not be handled in the first place... but users only care
that the images work and do not look broken.

## Overview and Requirements

Assume an original image, available via an HTTP URL:

![Original Image](https://raw.github.com/crrobinson14/actionhero/master/docs/original.png)

The classic thumbnailing approach uses a formatted URL to access a
thumbnailing service and generate a variant of the original image. For
example, we might ask our thumbnail service to create a 90x60
scale-and-crop version of the original 100x100 source file:

![Classic Approach](https://raw.github.com/crrobinson14/actionhero/master/docs/classic.png)

However, this naive approach has some problems. The most important is that
it is easy to DDoS such a service - an attacker can simply ask for every
possible size from 1..Infinity to overload the server. Thumbnailing is
"expensive" in terms of CPU resources.

But even if we solve the DDoS issue (which we will shortly), there are
other issues as well. If the Design team asks us to bump up the quality
of JPEG assets in our app, we need to add this parameter to every client
hitting the server (or hope for a messy, hard-to-maintain rewrite rule).
And because thumbs are generated only upon request, the first users
hitting our servers will have slower experiences, as they are the ones
"paying the bill" so to speak to get the images themselves. We could
try to script this, but then we have to know every possible size ahead
of time. What if we miss one?

![Signed URLs](https://raw.github.com/crrobinson14/actionhero/master/docs/signed.png)

The typical "next step," supported in Thumbor and most other options, is
to "sign" our URLs. This addresses the DDoS risk by only allowing pre-
approved operations... but falls short of addressing the entire issue.
It's also clumsy to implement because we need code changes in both our
servers and clients. What to do?

![Variant Approach](https://raw.github.com/crrobinson14/actionhero/master/docs/signed.png)

Finally, we arrive at the variant-based approach, which is also used in
Drupal's "Image Styles" module but we're delivering here as a packaged
micro-service. "Variants" is a five-dollar word for a five-cent concept:
it just means we will pre-defined our transforms, and access them by
ID instead of supplying all of the parameters in every request.
This is not a panacaea: we must know about and pre-define those variants
in the first place! But once we accept that burden, this option does fix
the other issues, and this is the reason this author chose this approach
for a recent project.

One word of caution about DDoS: if you're paying attention, you should
have noticed there is still one user-supplied parameter that is hard to
validate, and thus becomes an easy source of workload-injection: the
source URI of the image. This author was able to add an application-
specific database check to address that risk. You could also strip query
strings if your application doesn't need them, and/or add a domain
whitelist if you wanted to address this.

## Installation and Usage

This author chose NodeJS + ActionHero as the primary tech stack for the
reasons outlined here:

[How to Choose a NodeJS
Framework](https://medium.com/@CodeAndBiscuits/how-to-choose-a-nodejs-framework-a8a44bf73ad4#.i9ooww31u)

Installing the service is easy. SITS uses GraphicsMagick for image
transformation, so start by installing the
[prerequisites](https://github.com/aheckmann/gm#getting-started).

After that a simple `npm install` followed by an `npm start` is enough
to start the basic server. By default, the server will run on port 8080,
which you can change either by editing config/servers/web.js or setting
PORT when starting the server:

    PORT=3000 npm start

You could then make an API call to create a simple scale-and-crop
variant with a JPEG export:

    curl -H "Content-Type: application/json" \
         -X POST http://localhost:8080/api/variants \
         -d '{"apiKey":"CHANGEME", "id":"mediumthumb", "transforms":"-geometry 120x70^ -gravity center -extent 120x70"}'

To keep things simple for now, SITS assumes variant CRUD operations are
TRUSTED. This means all requests must include a secret API key as set in
`config/api.js`. Because this is ActionHero, an administrator can easily
change this secret key for different environments, overriding the developer's
defaults for QA, Production, etc. See [ActionHero
Config](https://www.actionherojs.com/docs/core/#config)
for an in-depth guide to configuring ActionHero-based projects.

As shown in the example above, image transformations are just a list of
GraphicsMagick options. All operations are technically available here
but only a subset actually make sense. Please refer to the [GraphicsMagick
Documentation](http://www.graphicsmagick.org/GraphicsMagick.html) for
more information on the available options. This example would change
the above operation to a top-center crop (ideal for head shots), and a
16:9 final output:

    curl -H "Content-Type: application/json" \
         -X POST http://localhost:8080/api/variants \
         -d '{"apiKey":"CHANGEME", "id":"widethumb", "transforms":"-geometry 120x67^ -gravity north -extent 120x67"}'

Variants may be listed with a GET request:

    curl http://localhost:8080/api/variants?apiKey=CHANGEME

would now output:

    {
      "variants": [
        {
          "id": "mediumthumb",
          "transforms": "-geometry 120x70^ -gravity center -extent 120x70",
          "createdAt": "2017-03-07T05:47:25.395Z",
          "updatedAt": "2017-03-07T05:47:25.395Z"
        },
        {
          "id": "widethumb",
          "transforms": "-geometry 120x67^ -gravity north -extent 120x67",
          "createdAt": "2017-03-07T05:49:32.691Z",
          "updatedAt": "2017-03-07T05:49:32.691Z"
        }
      ]
    }

We can also retrieve a single variant by its ID:

    curl http://localhost:8080/api/variants/widethumb?apiKey=CHANGEME

produces:

would now output:

    {
      "variants": [
        {
          "id": "mediumthumb",
          "transforms": "-geometry 120x70^ -gravity center -extent 120x70",
          "createdAt": "2017-03-07T05:47:25.395Z",
          "updatedAt": "2017-03-07T05:47:25.395Z"
        },
        {
          "id": "widethumb",
          "transforms": "-geometry 120x67^ -gravity north -extent 120x67",
          "createdAt": "2017-03-07T05:49:32.691Z",
          "updatedAt": "2017-03-07T05:49:32.691Z"
        }
      ]
    }
