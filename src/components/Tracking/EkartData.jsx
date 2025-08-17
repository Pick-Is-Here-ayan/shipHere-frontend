import React from "react";
import {
  Card,
  Descriptions,
  Row,
  Col,
  Typography,
  Steps,
  Progress,
  Carousel,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import statusVideo from "../../utils/DeliveryStatus2.mp4";

const { Title } = Typography;
const { Step } = Steps;

const EkartData = ({ trackingInfo, advertisement }) => {
  const trackingEvents = trackingInfo?.events || [];

  // Progress calculation (rough: based on scan codes)
  const stateToProgress = {
    Booked: 10,
    "Pending Pickup": 30,
    "In-transit": 60,
    Delivered: 100,
  };

  const parsedEvents = trackingEvents.map((e) => ({
    status: e.scan,
    remark: e.remark,
    location: e.location,
    date: e.scan_time,
    progress: stateToProgress[e.scan] || 5,
  }));

  const latest = parsedEvents[parsedEvents.length - 1] || {};
  const progress = latest.progress || 0;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "In-transit":
        return <SyncOutlined style={{ color: "#1890ff" }} />;
      case "Pending Pickup":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "Booked":
        return <SyncOutlined style={{ color: "#1890ff" }} />;
      default:
        return <CloseCircleOutlined style={{ color: "#999" }} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ background: "#f4f6f9", padding: "30px", minHeight: "100vh" }}>
      <Row gutter={[24, 24]} justify="center">
        {/* Left Side Card */}
        <Col xs={24} sm={8}>
          <Card
            hoverable
            style={{
              borderRadius: "16px",
              boxShadow: "0 6px 25px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #ffffff, #fafafa)",
            }}
          >
            <Title
              level={3}
              style={{ textAlign: "center", color: "#333", marginBottom: 20 }}
            >
              Tracking Information
            </Title>
            <Descriptions
              bordered
              column={1}
              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item label="AWB">
                {trackingInfo.awb || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Order ID">
                {trackingInfo.order_number || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {formatDate(trackingInfo.events[0].scan_time)}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Expected Delivery">
                {formatDate(trackingInfo.expectedDeliveryDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Type">
                {trackingInfo.paymentMode || "N/A"}
              </Descriptions.Item> */}
            </Descriptions>

            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              {advertisement && advertisement.images ? (
                <div>
                  <a
                    href={advertisement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={advertisement.images}
                      alt="Ad"
                      style={{
                        width: "100%",
                        height: "350px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </a>
                  {advertisement.description && (
                    <p
                      style={{
                        marginTop: "10px",
                        color: "#555",
                        fontSize: "20px",
                        fontWeight: "bolder",
                        marginBottom: "10px",
                      }}
                    >
                      {advertisement.description}
                    </p>
                  )}
                </div>
              ) : (
                <video
                  src={statusVideo}
                  autoPlay
                  muted
                  loop
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "-50px",
                  }}
                />
              )}
            </div>
          </Card>
        </Col>

        {/* Right Side Progress + Steps */}
        <Col xs={24} sm={16}>
          <Card style={{ marginBottom: 20, borderRadius: 10 }}>
            <Title level={4}>Shipment Progress</Title>
            <Progress
              percent={progress}
              status={progress === 100 ? "success" : "active"}
              strokeColor={progress === 100 ? "#52c41a" : "#1890ff"}
            />
          </Card>

          <Card
            style={{ maxHeight: "600px", overflowY: "auto", borderRadius: 10 }}
          >
            <Title level={4}>Tracking History</Title>
            <Steps direction="vertical" current={parsedEvents.length - 1}>
              {parsedEvents.map((event, idx) => (
                <Step
                  key={idx}
                  title={`${event.status} - ${formatDate(event.date)}`}
                  description={
                    <>
                      <p>
                        <strong>Remark:</strong> {event.remark}
                      </p>
                      <p>
                        <strong>Location:</strong> {event.location}
                      </p>
                    </>
                  }
                  icon={getStatusIcon(event.status)}
                />
              ))}
            </Steps>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EkartData;