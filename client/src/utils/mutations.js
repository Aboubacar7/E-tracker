import { gql } from "@apollo/client";

export const CREATE_EMPLOYEE = gql`
  mutation createEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      _id
      firstName
      lastName
      role {
        _id
        title
        salary
        department {
          _id
          name
        }
      }
      manager {
        _id
        firstName
        lastName
        role {
          _id
          title
          salary
          department {
            _id
            name
          }
        }
      }
    }
  }
`;

export const EDIT_EEMPLOYEE = gql`
  mutation EditEmployee($_id: ID!, $input: EditEmployeeInput!) {
    editEmployee(_id: $_id, input: $input) {
      _id
      firstName
      lastName
      role {
        _id
        title
        salary
        department {
          _id
          name
        }
      }
      manager {
        _id
        firstName
        lastName
        role {
          _id
          title
          salary
          department {
            _id
            name
          }
        }
      }
    }
  }
`;

export const CREATE_ROLE = gql`
  mutation createRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      _id
      title
      salary
      department {
        _id
        name
      }
    }
  }
`;

export const EDIT_ROLE = gql`
mutation EditRole($_id: ID!, $input: EditRoleInput!) {
  editRole(_id: $_id, input: $input) {
    _id
    title
    salary
    department {
      _id
      name
    }
  }
}`

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      name
    }
  }
`;

export const EDIT_DEPARTMENT = gql`
mutation EditDepartment($_id: ID!, $input: EditDepartmentInput!) {
  editDepartment(_id: $_id, input: $input) {
    _id
    name
  }
}`
