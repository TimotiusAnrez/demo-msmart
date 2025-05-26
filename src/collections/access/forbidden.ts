import { Access, FieldAccess } from 'payload'

export const ForbiddenFieldAccess: FieldAccess = () => false
export const ForbiddenCollectionAccess: Access = () => false
