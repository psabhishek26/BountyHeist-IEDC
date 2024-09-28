import React, { useState } from 'react';
import './login.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Row, Col } from 'antd';
import { supabase } from '../../supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      console.log('Full Response:', response); // Log the full response to check the structure
  
      const { data, error } = response;
  
      if (error) {
        alert(error.message);
        return;
      }
  
      if (data) {
        console.log('User:', data.user);
        console.log('Session:', data.session);
  
        // Proceed to update the user's metadata
        await updateUserMetadata(data.user);
      }
    } catch (err) {
      console.error('Unexpected Error:', err);
    }
  };
  
  // Function to generate a random 8-bit referral ID
  const generateReferralId = () => {
    return Math.random().toString(36).substr(2, 8); // Generates a random 8-character string
  };
  
  // Function to update user metadata after login
  const updateUserMetadata = async (user) => {
    try {
      const referralId = generateReferralId();  // Generate referral ID
      const metadata = {
        coins: 100,  // Set coins to 100
        referralId,  // Set the generated referral ID
      };
  
      // Update the user's metadata in Supabase
      const { data, error } = await supabase.auth.updateUser({
        data: metadata
      });
  
      if (error) {
        console.error('Error updating user metadata:', error.message);
      } else {
        console.log('User metadata updated successfully:', data);
      }
    } catch (err) {
      console.error('Unexpected error while updating metadata:', err);
    }
  };
    

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    setEmail(values.username);  // Set the email from the form
    setPassword(values.password);  // Set the password from the form
    signIn();  // Trigger the sign-in function
  };

  return (
    <div className='loginmotham'>
      <div className="headme">
        <h3>Bounty Heist</h3>
        <p>IEDC JECC</p>
      </div>
      <Form
        className='theloginmenu'
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}  // Update email in state
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}  // Update password in state
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
