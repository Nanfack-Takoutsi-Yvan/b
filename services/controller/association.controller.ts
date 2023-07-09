/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import assert from "assert"
import apiClient from "@services/api/api.client"

export class AssociationController implements IAssociationController {
  private resource

  constructor() {
    this.resource = {
      created: "api/associations/me",
      userAssociation: "api/associations/members/me",
      associationPage: {
        list: "api/association-pages/list"
      },
      membershipRequest: {
        all: "api/membership-requests"
      },
      associationsMembers: {
        default: {
          start: "api/associations/",
          end: "/members"
        }
      }
    }
  }

  public getAssociations = async (token: string, expect?: string) => {
    assert(token, "token is required")

    try {
      const res = await apiClient.get<IUserAssociation[]>(
        this.resource.userAssociation,
        {
          headers: { Authorization: token },
          params: {
            return: expect
          }
        }
      )

      if (!res) {
        throw new Error(`No association found using the token`)
      }

      return res.data
    } catch (error) {
      const err = {
        message: `Error while getting associations: ${error}`,
        error
      }

      throw new Error(JSON.stringify(err))
    }
  }

  public getCreatedAssociations = async (token: string, expect?: string) => {
    assert(token, "token is required")

    try {
      const res = await apiClient.get<IAssociationDataContent>(
        this.resource.created,
        {
          params: {
            return: expect
          },
          headers: {
            Authorization: token
          }
        }
      )

      if (!res) {
        throw new Error(`No association found using the token`)
      }

      return res.data
    } catch (error) {
      const err = {
        message: `Error while getting associations: ${error}`,
        error
      }

      throw new Error(JSON.stringify(err))
    }
  }

  public getAllAssociationPages = async (token: string) => {
    assert(token, "Token is required to fetch association page")

    try {
      const res = await apiClient.get<IAssociationPagesContent>(
        this.resource.associationPage.list,
        { headers: { Authorization: token } }
      )

      if (!res) {
        throw new Error(`No association page found`)
      }

      return res.data
    } catch (error) {
      const err = {
        message: `Error while getting page associations: ${error}`,
        error
      }

      throw new Error(JSON.stringify(err))
    }
  }

  public getAllMembershipRequest = async (token: string, status?: string) => {
    assert(token, "Token is required to fetch membership request")

    try {
      const res = await apiClient.get<IMembershipRequestContent>(
        this.resource.membershipRequest.all,
        {
          params: { return: "full", status },
          headers: { Authorization: token }
        }
      )

      if (!res) {
        throw new Error(`No membership request found`)
      }

      return res.data
    } catch (error) {
      const err = {
        message: `Error while getting membership request: ${error}`,
        error
      }

      throw new Error(JSON.stringify(err))
    }
  }

  public getAllAssociationMembers = async (token: string, id: string) => {
    assert(token, "Token is required to fetch association members")

    try {
      const res = await apiClient.get<IAssociationMemberContent>(
        `${this.resource.associationsMembers.default.start}${id}${this.resource.associationsMembers.default.end}`,
        { headers: { Authorization: token }, params: { return: "full" } }
      )

      if (!res) {
        throw new Error(`No association members found`)
      }

      return res.data
    } catch (error) {
      const err = {
        message: `Error while getting associations members: ${error}`,
        error
      }

      throw new Error(JSON.stringify(err))
    }
  }
}
