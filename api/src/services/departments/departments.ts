import type {
  QueryResolvers,
  MutationResolvers,
  DepartmentRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const departments: QueryResolvers['departments'] = () => {
  return db.department.findMany()
}

export const department: QueryResolvers['department'] = ({ id }) => {
  return db.department.findUnique({
    where: { id },
  })
}

export const createDepartment: MutationResolvers['createDepartment'] = ({
  input,
}) => {
  return db.department.create({
    data: input,
  })
}

export const updateDepartment: MutationResolvers['updateDepartment'] = ({
  id,
  input,
}) => {
  return db.department.update({
    data: input,
    where: { id },
  })
}

export const deleteDepartment: MutationResolvers['deleteDepartment'] = ({
  id,
}) => {
  return db.department.delete({
    where: { id },
  })
}

export const Department: DepartmentRelationResolvers = {
  Player: (_obj, { root }) => {
    return db.department.findUnique({ where: { id: root?.id } }).Player()
  },
  Script: (_obj, { root }) => {
    return db.department.findUnique({ where: { id: root?.id } }).Script()
  },
  ColorSet: (_obj, { root }) => {
    return db.department.findUnique({ where: { id: root?.id } }).ColorSet()
  },
  Bde: (_obj, { root }) => {
    return db.department.findUnique({ where: { id: root?.id } }).Bde()
  },
}
