// import React, { useEffect, useState } from 'react';
// import { Form, Input, Button, message } from 'antd';
// import { useSWRConfig } from 'swr';
// import { createUser, updateUser, getUsers } from '../api';

// const UserForm = ({ userId, onFormSubmit }) => {
//   const [form] = Form.useForm();
//   const { mutate } = useSWRConfig();

//   useEffect(() => {
//     if (userId) {
//       // Fetch user data for update
//       const fetchUserData = async () => {
//         const { data } = await getUsers(`/user/${userId}`);
//         form.setFieldsValue(data);
//       };
//       fetchUserData();
//     }
//   }, [userId, form]);

//   const handleSubmit = async (values) => {
//     try {
//       if (userId) {
//         await updateUser(userId, values);
//         message.success('User updated successfully!');
//       } else {
//         await createUser(values);
//         message.success('User created successfully!');
//       }
//       mutate('/user/workhistory'); // Re-fetch data after CRUD
//       onFormSubmit(); // Refresh parent component
//     } catch (err) {
//       message.error(err.response?.data?.errors?.[0]?.msg || 'Error occurred!');
//     }
//   };

//   return (
//     <Form form={form} layout="vertical" onFinish={handleSubmit}>
//       <Form.Item label="Workplace" name="workplace" rules={[{ required: true, message: 'Workplace is required' }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item label="Workplace Type" name="workplace_type" rules={[{ required: true, message: 'Workplace type is required' }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item label="Start Date" name="start_date" rules={[{ required: true, message: 'Start date is required' }]}>
//         <Input type="date" />
//       </Form.Item>
//       <Form.Item label="End Date" name="end_date" rules={[{ required: true, message: 'End date is required' }]}>
//         <Input type="date" />
//       </Form.Item>
//       <Form.Item label="Designation" name="designation" rules={[{ required: true, message: 'Designation is required' }]}>
//         <Input />
//       </Form.Item>
//       <Button type="primary" htmlType="submit">
//         {userId ? 'Update User' : 'Create User'}
//       </Button>
//     </Form>
//   );
// };

// export default UserForm;
