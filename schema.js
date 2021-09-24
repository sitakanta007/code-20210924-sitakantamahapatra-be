require('dotenv').config();
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const axios = require('axios');

// car details
const CarDetails = new GraphQLObjectType({
    name: 'CarDetails',
    fields:() => ({
        id: {type:GraphQLInt},
        brand: {type:GraphQLString},
        model: {type:GraphQLString},
        price: {type:GraphQLInt}
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        car: {
            type:CarDetails,
            args: {
                id: {type: GraphQLString}
            },
            resolve(parentValue, args) {
                return axios.get(process.env.JSON_SERVER_URL +"cars/"+ args.id)
                .then(result => result.data)
            }
        },
        carList: {
            type: new GraphQLList(CarDetails),
            resolve(parentValue, args) {
                return axios.get(process.env.JSON_SERVER_URL +"cars")
                .then(result => result.data)
            }
        },
        carFeatured: {
            type: new GraphQLList(CarDetails),
            resolve(parentValue, args) {
                return axios.get(process.env.JSON_SERVER_URL +"cars")
                .then(result => result.data.filter((field) => field.featured))
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});