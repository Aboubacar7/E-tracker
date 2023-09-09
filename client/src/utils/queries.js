import { gql } from "@apollo/client";

export const QUERY_EMPLOYEE = gql`
  query {
    employee {
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

export const QUERY_ROLE = gql`
  query {
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
`;

export const QUERY_DEPARTMENT = gql`
  query {
    department {
      _id
      name
    }
  }
`;
