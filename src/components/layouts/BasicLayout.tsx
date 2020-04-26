import React, { useContext, useState } from 'react'
import { RootContext } from '../../context'
import { Row, Col, Menu, Button, Modal, Spin, Input, notification } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authSignIn } from "../../services";
import { Link, Route } from 'react-router-dom'
import { SignInData } from '../../interfaces';

import Hello from '../Hello'
import Setting from '../Setting'
import CreateWorkBook from '../CreateWorkBook'

const rou: {
  [key: string]: {
    parent: string
    link: string
    icon: string
    page: () => JSX.Element
  }
} = {
  "主页": {
    parent: ``,
    link: `/`,
    icon: ``,
    page: Hello,
  },
  "创建workbook": {
    parent: ``,
    link: `/create_workbook`,
    icon: ``,
    page: CreateWorkBook,
  },
  "设置": {
    parent: ``,
    link: `/setting`,
    icon: ``,
    page: Setting,
  },
}

function generate_menu_item(key: string) {
  const item = rou[key];
  // 如果这个key恰好是一些key的父亲,
  //   那么他是一个submenu,
  //   否则他是一个item
  const children = Object.keys(rou).filter(k => rou[k].parent === key)
  return (children.length > 0 && item.parent === ``) ?
    (
      <Menu.SubMenu
        key={key}
        title={key}
      >
        {children.map(c => (
          <Menu.Item key={c}>
            <Link to={rou[c].link}>
              {rou[c].icon}{c}
            </Link>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
    ) : (
      <Menu.Item key={key}>
        <Link to={item.link}>
          {item.icon}
          <span>{key}</span>
        </Link>
      </Menu.Item>
    )
}

const BasicLayout = () => {
  const [rootState, setrootState] = useContext(RootContext)
  const [loginTabVisible, setloginTabVisible] = useState(false)
  const [loginLoading, setloginLoading] = useState(false);
  const [signInData, setsignInData] = useState<SignInData>({ username: "", password: "", site: "", server: "" })

  const signIn = async (data: SignInData) => {
    const uc = await authSignIn(
      data.server,
      data.username,
      data.password,
      data.site,
    )
    if (uc) {
      const newState = {
        ...rootState,
        userState: {
          signInData: data,
          userCredential: uc,
          loggedIn: true,
        }
      }
      console.log(newState)
      setrootState(newState)
    } else {
      notification.open({
        message: '登录失败',
        description:
          '可能是密码错了',
      });
    }
  }

  const onConfirmLogin = (data: SignInData) => {
    setloginLoading(true)
    signIn(data)
      .then(() => setloginTabVisible(false))
      .catch(() => setloginTabVisible(false))
      .finally(() => {
        setloginTabVisible(false)
        setloginLoading(false)
      })
  }

  return (
    <div>
      <Row>
        <Col span={16}>
          <Menu mode="horizontal">
            {Object.keys(rou).filter(k => rou[k].parent === ``).map(generate_menu_item)}
          </Menu>
        </Col>
        <Col span={8}>
          <Modal
            title="登录到 Tableau"
            visible={loginTabVisible}
            onOk={() => onConfirmLogin(signInData)}
            onCancel={() => { setloginTabVisible(false) }}
            okText="确定"
            cancelText="取消"
          >
            <Spin spinning={loginLoading} >
              <Input placeholder="用户名" prefix={<UserOutlined />} value={signInData.username} onChange={(v) => { setsignInData({ ...signInData, username: v.target.value }) }} />
              <Input.Password placeholder="密码" prefix={<LockOutlined />} value={signInData.password} onChange={(v) => { setsignInData({ ...signInData, password: v.target.value }) }} />
              <Input placeholder="site" value={signInData.site} onChange={(v) => { setsignInData({ ...signInData, site: v.target.value }) }} />
              <Input placeholder="server" value={signInData.server} onChange={(v) => { setsignInData({ ...signInData, server: v.target.value }) }} />
            </Spin>
          </Modal>
          {rootState.userState.loggedIn ? (
            <label>{rootState.userState.signInData?.username}</label>
          ) : (
              <Button onClick={() => setloginTabVisible(true)}>登录</Button>
            )}
        </Col>
      </Row>
      <Row>
        <Col>
          <div style={{ padding: 15 }}>
            <Route exact path={rou["主页"].link} component={rou["主页"].page} />
            <Route exact path={rou["创建workbook"].link} component={rou["创建workbook"].page} />
            <Route exact path={rou["设置"].link} component={rou["设置"].page} />
          </div>
        </Col>
      </Row>
    </div >
  )
}

export default BasicLayout
