import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} from 'graphql';
import Datastore from 'nedb';
import bookType from './book-type';

const books = new Datastore({ filename: '../data/books', autoload: true });

const authorType = new GraphQLObjectType({
  name: 'Author',
  description: 'The creator of books',
  fields:() => ({
    _id: {type: GraphQLID},
    name: {type: GraphQLString},
    image: {type: GraphQLString},
    books: {
      type: new GraphQLList(bookType),
      resolve: (author) => {
        return new Promise((resolve, reject) => {
          books.find({authorId: author._id}).exec((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });
      }
    }
  }),
});

export default authorType;
