import React, { useEffect, useState } from "react";
import { Card, Col, Row, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Fetching API data
const fetchData = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const postsData = await response.json();

  // Adding fake image URLs to each post for illustration purposes
  const enhancedData = postsData.map((post) => ({
    ...post,
    imageUrl: `https://picsum.photos/150?random=${post.id}`,
    bodyText: `This is an example of the post body text. ${post.body.slice(
      0,
      100
    )}...`,
  }));

  return enhancedData;
};

const PerformanceTest = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
      setLoading(false);
    };
    loadData();
  }, []);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <Spin indicator={antIcon} />
      ) : (
        <Row gutter={[16, 16]}>
          {data.slice(0, 1000).map((item) => (
            <Col span={8} key={item.id}>
              <Card hoverable cover={<img alt="example" src={item.imageUrl} />}>
                <Card.Meta title={item.title} description={item.bodyText} />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default PerformanceTest;
