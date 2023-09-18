const { AuthenticationError } = require("apollo-server-express");
const { Employee, Role, Department } = require("../models");

const resolvers = {
  Query: {
    employee: async () => {
      try {
        return await Employee.find()
          .populate({
            path: "role",
            populate: {
              path: "department",
            },
          })
          .populate({
            path: "manager",
            populate: {
              path: "role",
              populate: {
                path: "department",
              },
            },
          });
      } catch (error) {
        throw new Error("Failed to fetch employee details.");
      }
    },

    role: async () => {
      try {
        return await Role.find().populate("department");
      } catch (error) {
        throw new Error("Failed to fetch role details.");
      }
    },
    department: async (parent, { departmentName }) => {
      try {
        const params = departmentName ? { departmentName } : {};
        return await Department.find(departmentName);
      } catch (error) {
        throw new Error("Failed to fetch department details.");
      }
    },
  },
  Mutation: {
    createEmployee: async (_, { input }) => {
      try {
        const { firstName, lastName, roleTitle, managerLastName } = input;
        
        const role = await Role.findOne({ title: roleTitle });
        console.log("Found role:", role); 
        if (!role) {
          throw new Error(`Role with title '${roleTitle}' not found.`);
        }
        let managerId = null;
        if (managerLastName) {
         
          const manager = await Employee.findOne({ lastName: managerLastName });
          if (!manager) {
            throw new Error(
              `Manager with last name '${managerLastName}' not found.`
            );
          }
          if (manager) {
            managerId = manager._id.toString();
          }
        }

        const newEmployee = await Employee.create({
          firstName,
          lastName,
          role: role._id.toString(),
          manager: managerId,
        });
        console.log("New employee:", newEmployee);
        return newEmployee;
      } catch (error) {
        console.error("Error creating employee:", error);
        throw new Error("Failed to create a new employee.");
      }
    },

    editEmployee: async (_, { _id, input }) => {
      try {
        const employee = await Employee.findById(_id);
        console.log("Employee:", employee);
        if (!employee) {
          throw new Error(`Employee with ID ${_id} not found.`);
        }

        if (input.firstName) {
          employee.set({ firstName: input.firstName });
        }
        if (input.lastName) {
          employee.set({ lastName: input.lastName });
        }
        if (input.roleTitle) {
          const role = await Role.findOne({ title: input.roleTitle });
          console.log("role:", role);
          if (!role) {
            throw new Error(`Role with title '${input.roleTitle}' not found.`);
          }
          employee.set({ role: role._id });
        }
        if (input.managerLastName) {
          const manager = await Employee.findOne({
            lastName: input.managerLastName,
          });
          console.log("manager:", manager);
          if (!manager) {
            throw new Error(
              `Manager with last name '${input.managerLastName}' not found.`
            );
          }
          employee.set({ manager: manager._id });
        }

        const updatedEmployee = await employee.save();
        return updatedEmployee;
      } catch (error) {
        throw new Error(`Error updating employee: ${error.message}`);
      }
    },

    createRole: async (_, { input }) => {
      try {
        const { title, salary, departmentName } = input;

        const department = await Department.findOne({ name: departmentName });

        if (!department) {
          throw new Error(
            `Department with name '${departmentName}' not found.`
          );
        }

        const newRole = await Role.create({
          title,
          salary,
          department: department._id.toString(),
        });

        const populatedRole = await Role.findById(newRole._id).populate(
          "department"
        );

        return populatedRole;
      } catch (error) {
        console.error("Error creating a new role:", error.message);
        throw new Error("Failed to create a new role.");
      }
    },

    editRole: async (_, { _id, input }) => {
      try {
        const role = await Role.findById(_id);

        if (!role) {
          throw new Error(`Role with ID ${_id} not found.`);
        }

        if (input.title) {
          role.set({ title: input.title });
        }
        if (input.salary) {
          role.set({ salary: input.salary });
        }
        if (input.departmentName) {
         
          let department = await Department.findOne({
            name: input.departmentName,
          });
          console.log("department:", department);
          if (!department) {
          
            department = new Department({ name: input.departmentName });
            await department.save();
          }

          role.set({ department: department._id });
        }

        const updatedRole = await role.save();
        return updatedRole;
      } catch (error) {
        throw new Error(`Error updating role: ${error.message}`);
      }
    },

    createDepartment: async (_, { input }) => {
      try {
        const { name } = input;
        const newDepartment = await Department.create({ name });
        return newDepartment;
      } catch (error) {
        throw new Error("Failed to create a new department.");
      }
    },

    editDepartment: async (_, { _id, input }) => {
      try {
        const department = await Department.findById(_id);

        if (!department) {
          throw new Error(`Department with ID ${_id} not found.`);
        }

        if (input.name && input.name !== department.name) {
          const existingDepartment = await Department.findOne({
            name: input.name,
          });
          if (existingDepartment) {
            throw new Error(
              `Department with name "${input.name}" already exists.`
            );
          }
          department.name = input.name;
        }

        const updatedDepartment = await department.save();
        return updatedDepartment;
      } catch (error) {
        throw new Error(`Error updating department: ${error.message}`);
      }
    },

    deleteEmployee: async (_, { _id }) => {
      try {
        const deletedEmployee = await Employee.findByIdAndDelete(_id);
        if (!deletedEmployee) {
          throw new Error(`Employee with ID ${_id} not found.`);
        }
        return deletedEmployee;
      } catch (error) {
        throw new Error(`Error deleting employee: ${error.message}`);
      }
    },

    deleteRole: async (_, { _id }) => {
      try {
        const deletedRole = await Role.findByIdAndDelete(_id);
        if (!deletedRole) {
          throw new Error(`Role with ID ${_id} not found.`);
        }
        return deletedRole;
      } catch (error) {
        throw new Error(`Error deleting role: ${error.message}`);
      }
    },

    deleteDepartment: async (_, { _id }) => {
      try {
        const deletedDepartment = await Department.findOneAndDelete(_id);
        console.log("deleted department", deletedDepartment)
        if (!deletedDepartment) {
          throw new Error(`Department with ID ${_id} not found.`);
        }
        return deletedDepartment;
      } catch (error) {
        throw new Error(`Error deleting department: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;
