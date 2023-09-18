const { gql } = require("apollo-server");

const typeDefs = gql`
  type Employee {
    _id: ID
    firstName: String!
    lastName: String!
    role: [Role]!
    manager: [Employee]
  }

  type Role {
    _id: ID
    title: String!
    salary: Float!
    department: [Department]!
  }

  type Department {
    _id: ID
    name: String!
  }

  type Query {
    employee: [Employee]
    role: [Role]
    department(departmentName: String): [Department]
  }

  type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee
    createRole(input: CreateRoleInput!): Role!
    createDepartment(input: CreateDepartmentInput!): Department
    editEmployee(_id: ID!, input: EditEmployeeInput!): Employee
    editRole(_id: ID!, input: EditRoleInput!): Role
    editDepartment(_id: ID!, input: EditDepartmentInput!): Department
    deleteEmployee(_id: ID!): Employee
    deleteRole(_id: ID!): Role
    deleteDepartment(_id: ID!): Department
  }

  input CreateEmployeeInput {
    firstName: String!
    lastName: String!
    roleTitle: String!
    managerLastName: String 
  }

  input CreateRoleInput {
    title: String!
    salary: Float!
    departmentName: String
  }
  input CreateDepartmentInput {
    name: String!
  }

  input EditEmployeeInput {
    _id: ID!
    firstName: String
    lastName: String
    roleTitle: String
    managerLastName: String
  }

  input EditRoleInput {
    _id: ID!
    title: String
    salary: Float
    departmentName: String
  }

  input EditDepartmentInput {
    _id: ID!
    name: String
  }
`;

module.exports = typeDefs;
