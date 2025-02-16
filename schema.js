const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');

// Sample data
const movies = [
  { id: '1', name: 'Movie 1', director_name: 'Director 1', production_house: 'House 1', release_date: '2023-01-01', rating: 8 },
  { id: '2', name: 'Movie 2', director_name: 'Director 2', production_house: 'House 2', release_date: '2024-02-02', rating: 9 },
];

// Movie Type
const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    director_name: { type: GraphQLString },
    production_house: { type: GraphQLString },
    release_date: { type: GraphQLString },
    rating: { type: GraphQLInt },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return movies;
      },
    },
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return movies.find((movie) => movie.id === args.id);
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMovie: {
      type: MovieType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        director_name: { type: GraphQLNonNull(GraphQLString) },
        production_house: { type: GraphQLNonNull(GraphQLString) },
        release_date: { type: GraphQLNonNull(GraphQLString) },
        rating: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        const movie = {
          id: String(movies.length + 1),
          name: args.name,
          director_name: args.director_name,
          production_house: args.production_house,
          release_date: args.release_date,
          rating: args.rating,
        };
        movies.push(movie);
        return movie;
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        director_name: { type: GraphQLString },
        production_house: { type: GraphQLString },
        release_date: { type: GraphQLString },
        rating: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const movie = movies.find((movie) => movie.id === args.id);
        if (!movie) throw new Error('Movie not found');

        if (args.name) movie.name = args.name;
        if (args.director_name) movie.director_name = args.director_name;
        if (args.production_house) movie.production_house = args.production_house;
        if (args.release_date) movie.release_date = args.release_date;
        if (args.rating) movie.rating = args.rating;

        return movie;
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        const index = movies.findIndex((movie) => movie.id === args.id);
        if (index === -1) throw new Error('Movie not found');

        return movies.splice(index, 1)[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
