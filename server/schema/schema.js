const graphql = require('graphql');
var _ = require('lodash');
const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;


// Create Schemas (Types)
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Docs for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ userId: parent.id });
      }
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({ userId: parent.id });
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
        return User.findById(parent.userId);
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
        return User.findById(parent.userId);
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
      resolve(parent, args) {
        return User.find();
      }
    },

    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // we resolve data
        //get and return data from a data source

        return User.findById(args.id);
      }
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find();
      }
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Hobby.findById(args.id);
      }
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find();
      }
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Post.findById(args.id);
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
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString }
      },
      resolve(parent, args) {
        let user = new User({
          name: args.name,
          age: args.age,
          profession: args.profession
        });
        // save to db
        return user.save();
      }
    },

    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString }
      },
      resolve(parent, args) {
        let updatedUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession
            }
          },
          { new: true }
        );
        return updatedUser;
      }
    },

    createPost: {
      type: PostType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let post = new Post({
          comment: args.comment,
          userId: args.userId
        })

        post.save();
        return post;
      }
    },

    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let updatedPost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment
            }
          },
          { new: true }
        );
        return updatedPost;
      }
    },

    createHobby: {
      type: HobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let hobby = new Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId
        });

        hobby.save();
        return hobby;
      }
    },

    updateHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve(parent, args) {
        let updatedHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description
            }
          },
          { new: true }
        );
        return updatedHobby;
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})