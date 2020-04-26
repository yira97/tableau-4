import { defaultAPIVersion } from './constants'
import { Resp, PostJ, GetJ } from './core/networks';
import { UserCredential, ProjectInfo } from './interfaces';


const formatTableauUrl = (server: string, resource: string): string => {
  const u = `https://${server}/api/${defaultAPIVersion}/${resource}`
  return u;
}

const getTableauAuthedHeader = (token: string) => {
  return {
    "X-Tableau-Auth": token
  }
}

export const authSignIn = async (
  server: string,
  username: string,
  password: string,
  contentUrl: string,
): Promise<UserCredential | void> => {
  const res: Resp<{
    credentials: {
      site: {
        id: string,
        contentUrl: string
      },
      user: {
        id: string
      },
      token: string
    }
  }> = await PostJ(
    formatTableauUrl(server, "auth/signin"),
    {
      body: {
        "credentials": {
          "name": username,
          "password": password,
          "site": {
            "contentUrl": contentUrl
          }
        }
      }
    },
  )
  if (!res.ok) {
    console.log(res.error)
    return undefined;
  }

  const uc: UserCredential = {
    siteID: res.data.credentials.site.id,
    userID: res.data.credentials.user.id,
    token: res.data.credentials.token,
  }
  return uc;
}

export const listProjects = async (
  server: string,
  token: string,
  siteID: string,
): Promise<ProjectInfo[] | void> => {
  interface ListProjectAPIResponse {
    pagination: {
      pageNumber: string,
      pageSize: string,
      totalAvailable: string
    },
    projects: {
      project: {
        owner: {
          id: string
        },
        id: string,
        name: string,
        description: string,
        createdAt: string,
        updatedAt: string,
        contentPermissions: string
      }[]
    }
  }
  let res: Resp<ListProjectAPIResponse> = await GetJ(
    formatTableauUrl(server, `sites/${siteID}/projects`),
    {},
    {
      headers: getTableauAuthedHeader(token)
    }
  )
  if (!res.ok) {
    console.log(res.error)
    return undefined
  }
  const projectInfo = res.data.projects.project.map(proj => {
    return {
      projectID: proj.id,
      projectName: proj.name,
    }
  })
  return projectInfo
}