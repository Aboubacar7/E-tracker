import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// We import our HelloDiv from the components folder
import Nav from "./components/Nav";
import AddEmploeeCard from "./components/addEmployee";
import AddDepartmentCard from "./components/addDepartment";
import AddRoleCard from "./components/addRole";
import AllEmployee from "./components/employee";
import AllRole from "./components/role";
import AllDepartment from "./components/department";



const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
// App is our top-level main component that references other components
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Nav />
        <div>
          <Routes>
            <Route path="/addEmployee" element={<AddEmploeeCard />} />
            <Route path="/addDepartment" element={<AddDepartmentCard  />} />
            <Route path="/addRole" element={<AddRoleCard />} />
            <Route path="/employees" element={<AllEmployee/>} />
            <Route path="/roles" element={<AllRole />} />
            <Route path="/departments" element={<AllDepartment />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
