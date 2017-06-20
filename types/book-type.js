import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
} from 'graphql';
import Datastore from 'nedb';
import authorType from './author-type';

const authors = new Datastore({ filename: '../data/authors', autoload: true });

const bookType = new GraphQLObjectType({
  name: 'Book',
  description: 'Words on a page, tells a story.',
  fields:() => ({
    _id: {type: GraphQLID},
    title: {type: GraphQLString},
    image: {type: GraphQLString},
    authorId: {type: GraphQLID},
    description: {type: GraphQLString},
    author: {
      type: authorType,
      resolve: (book) => {
        return new Promise((resolve, reject) => {
          authors.find({_id: book.authorId}, (err, res) => {
            console.log(book.authorId, res)
            err ? reject(err) : resolve(res);
          });
        });
      }
    }
  }),
});

export default bookType;
