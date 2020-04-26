import React, { useContext, useState, useEffect } from 'react'
import { Row, Col, Input, Upload, Select } from 'antd'
import { RootContext } from '../context'
import { ProjectInfo } from '../interfaces'
import { listProjects } from '../services'

const CreateWorkBook = () => {
  const [rootState, setrootState] = useContext(RootContext)
  const [projectInfo, setprojectInfo] = useState<ProjectInfo[]>([])
  const [createWorkBookData, setcreateWorkBookData] = useState<{
    projectID: string
  }>({ projectID: "" })
  const loadProjectInfo = async () => {
    if (rootState.userState === undefined ||
      rootState.userState.userCredential === undefined ||
      rootState.userState.userCredential === undefined ||
      rootState.userState.signInData === undefined
    ) {
      console.log('get user failed')
      return
    }
    const proj = await listProjects(
      rootState.userState.signInData.server,
      rootState.userState.userCredential.token,
      rootState.userState.userCredential.siteID,
    )
    if (proj) {
      console.log(proj)
      setprojectInfo(proj)
    }
  }

  useEffect(() => {
    if (rootState.userState.loggedIn) {
      loadProjectInfo()
    }
  }, [])

  return (
    <div>
      <Row>
        <Col>
          <label>Project </label>
          <Select style={{ width: 120 }} onChange={(v) => { setcreateWorkBookData({ ...createWorkBookData, projectID: v.toString() }) }}>
            {projectInfo.map(pi => {
              return <Select.Option value={pi.projectID} key={pi.projectID}>
                {pi.projectName}
              </Select.Option>
            })}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col>
          <label>Workbook名称</label>
          <Input></Input>
        </Col>
      </Row>

    </div>
  )
}

export default CreateWorkBook
