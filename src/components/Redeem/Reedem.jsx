import React from 'react';
import { Flex, Input, Typography } from 'antd';
import "./redeem.css";
const { Title } = Typography;


const Reedem = () => {

    const onChange = (text) => {
        console.log('onChange:', text);
      };
      const sharedProps = {
        onChange,
      };
  return (
    <div className='redeemdiv'>
      <h3>Enter Code</h3>
      <p>Enter 8 bit alpha numeric code</p>
      {/* meeh */}

      <Flex className='optt' gap="middle" align="flex-start" vertical>
      <Input.OTP length={8} size='large' formatter={(str) => str.toUpperCase()} {...sharedProps} />
      
    </Flex>

      <button className='redsub'>Submit</button>
    </div>
  )
}

export default Reedem
