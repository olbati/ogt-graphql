import {
  GraphQLID,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';

const authorInputType = new GraphQLInputObjectType({
  name: 'AuthorInput',
  fields:() => ({
    _id: {type: GraphQLID},
    name: {type: GraphQLString},
    image: {type: GraphQLString}
  }),
});

export default authorInputType;
