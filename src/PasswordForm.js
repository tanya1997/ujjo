
import React, { useCallback, useContext, useEffect, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { Button, Dialog, Space, Toast, Divider, Dropdown, Radio, Input, Checkbox, Form, Card  } from 'antd-mobile'
import { EyeInvisibleOutline, EyeOutline} from 'antd-mobile-icons'
import './App.css'

function PasswordForm (props, ref) {
    const [visiblePassword, setVisiblePassword] = useState(false)
    const [password, setPassword] = useState("")

    useImperativeHandle(ref, () => ({

        getVisiblePassword(){
            return visiblePassword;
  
          },
        getPassword(){
            return password;
        },
    }));


   return (
    <div>
            <Form layout='horizontal' style={{paddingTop: 15}}>

            <Form.Item
            name='password'
            extra={
                <div >
                {!visiblePassword ? (
                    <EyeInvisibleOutline onClick={() => setVisiblePassword(true)} />
                ) : (
                    <EyeOutline onClick={() => setVisiblePassword(false)} />
                )}
                </div>
            }
            >
            <Input
                className='inputBorderTextAreaGray'
                placeholder='password'
                clearable
                onChange={(e) => setPassword(e)}
                value={password}
                type={visiblePassword ? 'text' : 'password'}
            />
            </Form.Item>
        </Form>
    </div>
   );
}
export default forwardRef(PasswordForm);