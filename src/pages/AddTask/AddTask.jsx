import React, { useEffect, useState } from "react";
import "./addtask.css";
import { Button, Form, Input, message, Spin } from "antd";
import { getDatabase, ref, set, get } from "firebase/database";

const AddTask = () => {
  const [form] = Form.useForm();
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTaskCount = async () => {
      const db = getDatabase();
      const taskRef = ref(db, "tasks");
      const snapshot = await get(taskRef);
      const taskLength = snapshot.exists()
        ? Object.keys(snapshot.val()).length
        : 0;
      setTaskCount(taskLength + 1);
      setLoading(false);
    };

    getTaskCount();
  }, [loading]);

  const onFinish = async (values) => {
    setLoading(true);
    const { taskdescription, taskpoints, redirectlink } = values;

    try {
      const taskId = `task${taskCount}`;
      const taskname = `Task ${taskCount}`;

      const taskData = {
        taskName: taskname,
        taskDescription: taskdescription,
        taskPoints: taskpoints,
        redirectLink: redirectlink,
        taskId: taskId,
      };

      const db = getDatabase();
      await set(ref(db, `tasks/${taskId}`), taskData);

      message.success("Task added successfully!");
      form.resetFields();
    } catch (error) {
      console.error(`Error: ${error.message}`);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="regmotham">
      <Form form={form} name="addtask" onFinish={onFinish} scrollToFirstError>
        <Form.Item label="Task Name">
          <Input placeholder={`Task ${taskCount}`} disabled />
        </Form.Item>
        <Form.Item
          name="taskdescription"
          label="Task Description"
          rules={[
            { required: true, message: "Please input task description!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="taskpoints"
          label="Task Points"
          rules={[{ required: true, message: "Please input task points!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="redirectlink"
          label="Redirect Link"
          rules={[
            { type: "url", message: "Please input a valid URL!" },
            { required: true, message: "Please input the redirect link!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Task
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTask;
