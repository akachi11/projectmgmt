const Client = require('../models/client');
const Project = require('../models/project');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');

// Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId)
            }
        }
    })
})

// Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // Get a single project
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        },

        // Get all projects
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find()
            }
        },

        // Get a single client
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id)
            }
        },

        // Get all clients
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find()
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Add a new client
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return client.save()
            }
        },

        // Add a new project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            NEW: { value: 'Not Started' },
                            IN_PROGRESS: { value: 'In Progress' },
                            COMPLETED: { value: 'Completed' }
                        }
                    }),
                    defaultValue: 'Not Started'
                },
                clientId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })
                return project.save()
            }
        },

        // Delete a project
        deleteProject: {
            type: ProjectType,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Project.findByIdAndDelete(args.id)
            }
        },

        // Delete a client
        deleteClient: {
            type: ClientType,
            args: { id: { type: GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Client.findByIdAndDelete(args.id)
            }
        },

        // Update a project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            NEW: { value: 'Not Started' },
                            IN_PROGRESS: { value: 'In Progress' },
                            COMPLETED: { value: 'Completed' }
                        }
                    }),
                },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(args.id, args, { new: true })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})