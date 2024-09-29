import React, { useContext } from "react";
import "./login.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Row, Col, message } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  
  const onFinish = (values) => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          const db = getDatabase();
          const userRef = ref(db, "users/" + user.uid);

          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setUser(data);
              navigate("/");
              message.success("Login successful!");
            }
          });
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Login error:", errorCode, errorMessage);
        message.error("Login failed: " + errorMessage);
      });
  };

  return (
    <div className="loginmotham">
      <div className="headme">
        <h3>Bounty Heist</h3>
        <p>IEDC JECC</p>
      </div>
      <Form
        className="theloginmenu"
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Row justify="space-between" align="middle">
            <Col>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Col>
            <Col>
              <a href="">Forgot password</a>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
          or <a href="/register">Register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
