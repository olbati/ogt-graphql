import {
  GraphQLID,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';

const bookInputType = new GraphQLInputObjectType({
  name: 'BookInput',
  fields:() => ({
    _id: {type: GraphQLString},
    title: {type: GraphQLString},
    image: {type: GraphQLString},
    description: {type: GraphQLString},
    authorId: {type: GraphQLString},
  }),
});

export default bookInputType;
