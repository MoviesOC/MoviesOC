# The Movies OC

## Our Vision

Have an easy-to-use website that brings fun to the people who look for movies.

## How it works

A User chooses one of the categories on the homepage and gets a randomized movie depending on the genre. Before using the functions of the website, the user has to sign up and log in.

When looking at the movie recommendation a user can choose from four options. They can either decide the movie recommendation sounds good and they like it, the movie recommendation sucks, they have already watched the movie or they don't care about the recommendation and want a whole new movie without interacting.

After choosing one of the first three options, the movie will be added to the user profile, where it can be examined in more detail, as well as moved from list to list, delete the movie from the whole profile or watch the trailer.

A search option is also available.

You can try a demo on [Heroku](https://movies-oc.herokuapp.com)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

If you want to try the app locally you need have NodeJS and MongoDB installed on your computer (information on how to install Node [here](https://nodejs.org/en/download/) or [here](https://github.com/creationix/nvm#installation) and for MongoDB [here](https://docs.mongodb.com/manual/administration/install-community/).

### Installing

A step by step series of examples that tell you how to get a development env running

First you need to clone the project

```
$ git clone https://github.com/MoviesOC/MoviesOC.git
```

Change your directory:

```
$ cd movies-oc
```

Install all the dependencies:

```
$ npm install
```

In order to run the application, you need to open the terminal window and run this command:

```
$ npm run dev
```

## Files to add

You should have a `.env` file with the following values:

```
PORT=3000
MOVIEDB_API_KEY= // -> Here your MovieDB API key
MONGODB_URI=mongodb://localhost/movies-oc
```

In order to have access to the MovieDB you will need to create an account at the Movie Database [here](https://www.themoviedb.org/account/signup) and paste it in the .env file.
