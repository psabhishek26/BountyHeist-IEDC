import React, { useContext, useState } from "react";
import "./register.css";
import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { generateCodeSix } from "../../utils/Utils";

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [form] = Form.useForm();

  const generateUniqueCode = async () => {
    const db = getDatabase();
    let newCode;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      newCode = generateCodeSix();
      const codeRef = ref(db, `referrels/${newCode}`);
      const snapshot = await get(codeRef);
      if (!snapshot.exists()) {
        return newCode;
      }
      attempts++;
    } while (attempts < maxAttempts);

    throw new Error("Failed to generate a unique code. Please try again.");
  };

  const onFinish = async (values) => {
    const { username, email, password, phone } = values;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const uniqueCode = await generateUniqueCode();

      const userData = {
        username: username,
        email: email,
        phone: phone,
        uid: user.uid,
        coins: 100,
        referralCode: uniqueCode,
      };

      const db = getDatabase();
      await set(ref(db, `users/${user.uid}`), userData);
      await set(ref(db, `referrels/${uniqueCode}`), { uid: user.uid });

      setUser(userData);
      navigate("/");
    } catch (error) {
      console.error(`Error: ${error.message}`);
      message.error(error.message);
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="91">+91</Option>
      </Select>
    </Form.Item>
  );

  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        [".com", ".org", ".net"].map((domain) => `${value}${domain}`)
      );
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  return (
    <div className="regmotham">
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{ prefix: "91" }}
        scrollToFirstError
      >
        <Form.Item
          name="username"
          label="Username"
          tooltip="What do you want to be called?"
          rules={[
            {
              required: true,
              message: "Please input your username!",
              whitespace: false,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            { type: "email", message: "The input is not valid E-mail!" },
            { required: true, message: "Please input your E-mail!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Should accept agreement")),
            },
          ]}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
