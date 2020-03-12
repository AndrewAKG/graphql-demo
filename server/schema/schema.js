const graphql = require('graphql');
var _ = require('lodash');

//dummy data
const usersData = [
  { id: '1', name: 'Bond1', age: 20 },
  { id: '12', name: 'Bond2', age: 21 },
  { id: '123', name: 'Bond3', age: 22 },
  { id: '1234', name: 'Bond4', age: 23 },
  { id: '12345', name: 'Bond5', age: 24 },
];

const hobbiesData = [
  { id: '1', title: 'Programming', userId: '1' },
  { id: '2', title: 'Swimming', userId: '12' },
  { id: '3', title: 'Reading', userId: '123' },
  { id: '4', title: 'Football', userId: '1' },
  { id: '5', title: 'Volleyball', userId: '1' },
];

const postsData = [
  { id: '1', comment: 'Hi from graphql', userId: '1' },
  { id: '2', comment: 'Graph QL is Amazing', userId: '12' }
];

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = graphql;


// Create Schemas (Types)
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Docs for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return _.filter(postsData, { userId: parent.id })
      }
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return _.filter(hobbiesData, { userId: parent.id })
      }
    }
  })
});


const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Hobby for User',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(usersData, { id: parent.userId })
      }
    }
  })
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Users Posts',
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(usersData, { id: parent.userId })
      }
    }
  })
})


//Create Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Desc',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args){
        return usersData;
      }
    },

    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // we resolve data
        //get and return data from a data source

        return _.find(usersData, { id: args.id });
      }
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args){
        return hobbiesData;
      }
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(hobbiesData, { id: args.id })
      }
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args){
        return postsData;
      }
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(postsData, { id: args.id })
      }
    }
  }
});

//Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let user = {
          id: args.id,
          name: args.name,
          age: args.age
        }

        return user;
      }
    },

    createPost: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
        comment: { type: GraphQLString },
        userId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let post = {
          id: args.id,
          comment: args.comment,
          userId: args.userId
        }
        return post;
      }
    },

    createHobby: {
      type: HobbyType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        userId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let hobby = {
          id: args.id,
          title: args.title,
          userId: args.userId
        }
        return hobby;
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})