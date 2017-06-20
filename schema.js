import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import Datastore from 'nedb';
import bookType from './types/book-type';
import bookInputType from './types/book-input-type';
import authorType from './types/author-type';
import authorInputType from './types/author-input-type';

const authors = new Datastore({ filename: './data/authors', autoload: true });
const books = new Datastore({ filename: './data/books', autoload: true });

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'QueryRoot',
    fields: {
      authors: {
        type: new GraphQLList(authorType),
        resolve: _ => {
          return new Promise((resolve, reject) => {
            authors.find({}).exec((err, res) => {
              err ? reject(err) : resolve(res);
            });
          });
        }
      },
      books: {
        type: new GraphQLList(bookType),
        resolve: _ => {
          return new Promise((resolve, reject) => {
            books.find({}).exec((err, res) => {
              err ? reject(err) : resolve(res);
            });
          });
        }
      },
      bookSearch: {
        type: new GraphQLList(bookType),
        args: {
          keyword: {
            type: GraphQLString,
          }
        },
        resolve: (object, {keyword}, context, info) => {
          return new Promise((resolve, reject) => {
            books.find({title: keyword}).exec((err, res) => {
              err ? reject(err) : resolve(res);
            });
          });
        }
      },
      secret: {
        type: GraphQLString,
        resolve: (object, args, context, {rootValue}) => {
          const user = rootValue.user;
          if(!user) {
            return 'only authorized users can know the secret';
          }
          if(user.name === 'admin' && user.pass === '123') {
            return 'howdy admin';
          }
          return 'who are you?';
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'MutationRoot',
    fields: {
      addBook: {
        type: bookType,
        args: {
          book: {
            type: bookInputType,
          }
        },
        resolve: (object, {book}) => {
          return new Promise((resolve, reject) => {
            books.insert(book, (err, res) => {
              err ? reject(err) : resolve(res);
            });
          });
        }
      },
      updateBook: {
        type: bookType,
        args: {
          book: {
            type: bookInputType,
          }
        },
        resolve: (object, {book}) => {
          return new Promise((resolve, reject) => {
            books.update({_id: book._id}, {$set: book}, {returnUpdatedDocs: true}, (err, num, res) => {
              console.log(book, res);
              err ? reject(err) : resolve(book);
            });
          });
        }
      },
      addAuthor: {
        type: authorType,
        args: {
          author: {
            type: authorInputType,
          }
        },
        resolve: (object, {author}) => {
          return new Promise((resolve, reject) => {
            authors.insert(author, (err, res) => {
              err ? reject(err) : resolve(res);
            });
          });
        }
      }
    }
  }),
});

export default schema;
