import { lazy } from "react";
import React, { useState } from 'react';
import { useStepsForm } from 'sunflower-antd';
import { Steps, Input, Button, Form, Result, Card, Select, Radio, Checkbox, RadioChangeEvent, Image, Space, Layout } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

import IntroContent from "../../content/IntroContent.json";
import MiddleBlockContent from "../../content/MiddleBlockContent.json";
import AboutContent from "../../content/AboutContent.json";
import MissionContent from "../../content/MissionContent.json";
import ProductContent from "../../content/ProductContent.json";
import ContactContent from "../../content/ContactContent.json";
import axios from "axios";
import { Content, Footer, Header } from "antd/lib/layout/layout";

const Contact = lazy(() => import("../../components/ContactForm"));
const MiddleBlock = lazy(() => import("../../components/MiddleBlock"));
const Container = lazy(() => import("../../common/Container"));
const ScrollToTop = lazy(() => import("../../common/ScrollToTop"));
const ContentBlock = lazy(() => import("../../components/ContentBlock"));

const { Option } = Select;
const { Step } = Steps;
const plainOptions = ['Dine-In', 'Delivery', 'Pickup'];
interface MenuItem {

  [key: string]: string[];
}
const feelings = [
  'Fatigued',
  'Sleepy',
  'Hungry',
  'Angry',
  'Lonely',
  'Sad',
  'Happy',
  'Bored',
  'Overweight',
  'Underweight',
  'High Glucose',
  'Headache'
];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const Home = () => {
  const [value1, setValue1] = useState('Dine-In');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [feel, setFeelings] = useState<string[]>([]);
  const onChange1 = ({ target: { value } }: RadioChangeEvent) => {
    setValue1(value);
  };

  const onChange = (checkedValues: CheckboxValueType[]) => {
    let values: string[] = [];
    console.log(checkedValues);

    checkedValues.forEach(feel => {
      values.push(feel.toString())
    });
    setFeelings(values);
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
        defaultValue={'+86'}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const {
    form,
    current,
    gotoStep,
    stepsProps,
    formProps,
    submit,
    formLoading,
  } = useStepsForm({
    submit(values) {
      const { soulgoodno, fnamelname, email, address, phone, zipcode, deliveryoption } = values;
      console.log(fnamelname, email, address, feelings);
      // axios.post('http://localhost:8000/api/getdata/', {
      //   "feeling": "ill"
      // }).then((data) => {

      //   console.log(data);

      // });
      return 'ok';
    },
    total: 3,
  });


  const formList = [
    <>
      <Form.Item
        label="Soulgood Number(Optional)"
        name="soulgoodno"

      >
        <Input placeholder="Soulgood No." />
      </Form.Item>
      <Form.Item
        label="Customer first & last name"
        name="fnamelname"
        rules={[
          {
            required: true,
            message: 'Please input first name and last name',
          },
        ]}
      >
        <Input placeholder="First name and Last name" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input

          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item label="Email" name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email address',
          },
        ]}>
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        label="Your Zip Code"
        name="zipcode"

      >
        <Input placeholder="Zip code is required" />
      </Form.Item>
      <Form.Item label="Delivery Option" name="deliveroption" valuePropName="checked">
        <Radio.Group options={plainOptions} onChange={onChange1} value={value1} />

      </Form.Item>
      <Form.Item label="How do you feel" name="feelings" valuePropName="checked">
        <Checkbox.Group options={feelings} onChange={onChange} defaultValue={feel} />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" onClick={() => {
          console.log(form.getFieldsValue());

          if (form.getFieldValue('feelings') && form.getFieldValue('feelings').length > 0) {
            var feels: number[] = [];

            for (let i = 0; i < form.getFieldValue('feelings').length; i++) {
              feels.push(feelings.indexOf(form.getFieldValue('feelings')[i]) + 1)

            }
            // { soulgoodno, fnamelname, email, address, phone, zipcode, deliveryoption }

            axios.post('http://localhost:8000/api/getdata/', {
              "feeling": feels,
              ...form.getFieldsValue(),
              'deliveryoption': value1
            }).then((data) => {
              setMenuItems(data.data.menu_items)
              gotoStep(current + 1)

            });
          } else {
            gotoStep(current + 1)


          }

        }}>Next</Button>
      </Form.Item>
    </>,

    <>

      <Image.PreviewGroup >
        <Layout style={{ backgroundColor: "transparent" }}>

          {Object.entries(menuItems).map(([key, value]) => {
            return (
              <Space size={12} >
                <Checkbox
                  style={{ fontSize: 13, width: '100px' }}
                >
                  {value}
                </Checkbox>
                <Image width={200} src={`/img/menuitems/${value}-min.jpg`} />

              </Space>)
          })
          }
        </Layout>

      </Image.PreviewGroup>
      <Form.Item {...tailLayout}>
        <Button
          style={{ marginRight: 10 }}
          type="primary"
          loading={formLoading}
          onClick={() => {
            submit().then(result => {
              if (result === 'ok') {
                gotoStep(current + 1);
              }
            });
          }}
        >
          Submit
        </Button>
        <Button onClick={() => gotoStep(current - 1)}>Prev</Button>
      </Form.Item>
    </>,
  ];

  return (
    <Container>
      <ScrollToTop />
      <Card style={{ marginBottom: 60 }}>
        <Steps {...stepsProps}>
          <Step title="How do you feel" />
          <Step title="May we suggest this menu" />
          <Step title="Checkout" />
        </Steps>
        <div style={{ marginTop: 60 }}>
          <Form {...layout} {...formProps} style={{ maxWidth: 600 }}>
            {formList[current]}
          </Form>

          {current === 2 && (
            <Result
              status="success"
              title="Submit is succeed!"
              extra={
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      form.resetFields();
                      gotoStep(0);
                    }}
                  >
                    Buy it again
                  </Button>
                  <Button>Check detail</Button>
                </>
              }
            />
          )}
        </div>
      </Card>
    </Container >
  );
};

export default Home;
