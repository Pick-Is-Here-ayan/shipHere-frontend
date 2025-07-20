import { MenuFoldOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  message,
  Modal,
  Popover,
  Space,
  Table,
  Tag,
} from "antd";
import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";

const ActionRequiredTab = ({
  rowSelection,
  selectedRowKeys,
  dataSource,
  setSelectedRowKeys,
  handleReattemptSuccess,
  selectedOrderData,
  fetchOrders,
}) => {
  //console.log(dataSource);
  //console.log(selectedRowKeys);
  //console.log(selectedOrderData);

  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [actionType, setActionType] = useState(null); // 👈 Which action is selected
  const [additionalNotes, setAdditionalNotes] = useState(""); // 👈 For Re-attempt notes

  const handleAction = async (action) => {
    if (selectedOrderData.length === 0) {
      message.warning("Please select at least one order.");
      return;
    }

    if (action === "Reschedule" && !selectedDate) {
      message.warning("Please select a date for the Reschedule.");
      return;
    }

    setLoading(true);
    try {
      const ecomPayload = {
        orders: selectedOrderData,
        comment:
          action === "Reschedule"
            ? `${selectedDate.format("DD/MM/YYYY")}`
            : action,
        instruction: action === "RTO" ? "RTO" : "RAD",
      };

      const otherPayload = {
        orderIds: selectedOrderData.map((order) => order._id),
        comment: selectedOrderData[0].shipmentDetails.comments
          ? selectedOrderData[0].shipmentDetails.comments
          : "",
        date:
          action === "Reschedule"
            ? `${selectedDate.format("DD/MM/YYYY")}`
            : action === "RTO"
            ? "RTO"
            : "",
        action: action === "Reschedule" ? `1` : "2",
      };

      if (selectedOrderData[0].shippingPartner === "Ecom Express") {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/ecomExpress/createNdr`,
          ecomPayload,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
      } else if (selectedOrderData[0].shippingPartner === "Amazon Shipping") {
        let ac =
          action === "Re-attempt"
            ? "REATTEMPT"
            : action === "RTO"
            ? "RTO"
            : "RESCHEDULE";

        const amazonPayloads = selectedOrderData.map((order) => ({
          trackingId: order.awb,
          ndrAction: ac,
          ndrRequestData:
            ac === "REATTEMPT"
              ? {
                  additionalAddressNotes:
                    additionalNotes.trim() ||
                    order.shipmentDetails?.comments?.trim() ||
                    "Please reattempt delivery",
                }
              : ac === "RESCHEDULE"
              ? {
                  rescheduleDate: selectedDate.format("YYYY-MM-DDTHH:mm:ss"),
                  additionalAddressNotes: "",
                }
              : { additionalAddressNotes: "Return to origin requested" },
        }));

        for (const payload of amazonPayloads) {
          console.log("amazonpayload: ", payload);
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/amazon/ndrfeedback`,
            payload,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
        }
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/smartship/orderReattempt`,
          otherPayload,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
      }

      const updateStatusPromises = selectedOrderData.map(async (order) => {
        if (order.reattemptcount <= 3) {
          // 2<=3
          const updatedStatus = {
            ndrstatus:
              action === ("Re-attempt" || "Reschedule") ? "Taken" : "RTO",
            ...(action === ("Re-attempt" || "Reschedule") && {
              reattemptcount: order.reattemptcount + 1,
            }),
          };
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/orders/updateOrderStatus/${
              order._id
            }`,
            updatedStatus,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
        } else {
          const updatedStatus = {
            ndrstatus: "RTO",
            ...(action === ("Re-attempt" || "Reschedule") && {
              reattemptcount: order.reattemptcount + 1,
            }),
          };
          await axios.put(
            `${import.meta.env.VITE_API_URL}/api/orders/updateOrderStatus/${
              order._id
            }`,
            updatedStatus,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
        }
      });

      await Promise.all(updateStatusPromises);
      fetchOrders();
      // setSelectedRowKeys([])
      message.success("Action successfully applied to selected orders.");
    } catch (error) {
      console.error("Error applying action:", error);
      message.error(error?.response?.data?.error[0]?.error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedDate(null);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const showModal = (type) => {
    if (selectedOrderData.length === 0) {
      message.warning("Please select at least one order.");
      return;
    }
    setActionType(type); // 👈 store which action is being performed
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setAdditionalNotes("");
    setActionType(null);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : "black" }} />
    ),
    onFilter: (value, record) => {
      const keys = dataIndex.split(".");
      let data = record;
      keys.forEach((key) => {
        data = data ? data[key] : null;
      });
      return data
        ? data.toString().toLowerCase().includes(value.toLowerCase())
        : "";
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: "#ffc069", padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Order Id",
      dataIndex: "orderId",
      ...getColumnSearchProps("orderId"),
      render: (text, order) => (
        <Link
          style={{
            color: "black",
            fontWeight: "400",
            fontFamily: "Poppins",
            textAlign: "center",
          }}
          to={`/orders/In/updateorder/${order?._id}/${order?.orderId}`}
        >
          {order.orderId}
        </Link>
      ),
      className: "centered-row",
    },
    {
      title: "Order Status",
      dataIndex: "o_status",
      ...getColumnSearchProps("awb"), // Reusing getColumnSearchProps for consistency
      render: (text, order) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Display AWB as a clickable link */}
          <span style={{ marginRight: "2rem" }}>
            {order.shippingPartner && order.awb && (
              <a
                target="_blank"
                href={`/tracking/shipment/${order.shippingPartner}/${order.awb}`}
              >
                <Button type="link">{order.awb ? order.awb : "no"}</Button>
              </a>
            )}
          </span>
          {/* Display the order status with appropriate color */}
          <Tag
            style={{
              display: "flex",
              justifyContent: "center",
              maxWidth: "max-content",
              marginLeft: "3rem",
            }}
            color={order.status === "New" ? "green" : "volcano"}
          >
            {order.status}
          </Tag>
        </div>
      ),
      className: "centered-row",
    },
    {
      title: "Customer Info",
      dataIndex: "customerName",
      ...getColumnSearchProps("customerName"),
      render: (text, order) => (
        <div
          style={{
            fontFamily: "Poppins",
            fontSize: ".9rem",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          <div>{order.customerName}</div>
          <div>{order.customerPhone}</div>
        </div>
      ),
      className: "centered-row",
    },
    {
      title: "Payment Details",
      dataIndex: "paymentMethod",
      filters: [
        { text: "COD", value: "COD" },
        { text: "Prepaid", value: "prepaid" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
      render: (text, order) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "4.5rem",
            marginLeft: "5rem",
            fontFamily: "Poppins",
            fontSize: ".9rem",
            fontWeight: "500",
          }}
        >
          <div>&#8377; {order.productPrice}</div>
          <Tag
            color={
              order.paymentMethod === "COD"
                ? "green-inverse"
                : "geekblue-inverse"
            }
          >
            {order.paymentMethod}
          </Tag>
        </div>
      ),
      className: "centered-row",
    },
    {
      title: "Reason",
      render: (text, order) => (
        <div
          style={{
            fontFamily: "Poppins",
            fontSize: ".9rem",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          <div>{order?.reason}</div>
        </div>
      ),
      className: "centered-row",
    },

    {
      title: "Order Date",
      dataIndex: "updatedAt",
      ...getColumnSearchProps("updatedAt"),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const [rangePickerValue, setRangePickerValue] = React.useState(null);

        return (
          <div style={{ padding: 8 }}>
            <DatePicker.RangePicker
              value={rangePickerValue}
              style={{ marginBottom: 8, display: "block" }}
              onChange={(dates) => {
                if (dates) {
                  const startDate = dates[0].startOf("day").toISOString();
                  const endDate = dates[1].endOf("day").toISOString();
                  setSelectedKeys([[startDate, endDate]]);
                  setRangePickerValue(dates);
                } else {
                  setSelectedKeys([]);
                  setRangePickerValue(null);
                }
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90 }}
              >
                Filter
              </Button>
              <Button
                onClick={() => {
                  clearFilters();
                  setRangePickerValue(null); // Reset the RangePicker value
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </div>
        );
      },
      onFilter: (value, record) => {
        const [startDate, endDate] = value;
        const orderDate = moment(record.updatedAt).toISOString();
        return orderDate >= startDate && orderDate <= endDate;
      },
      render: (text, order) => (
        <>
          <div>
            {moment(order?.updatedAt).format("DD-MM-YYYY")}
            <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
              {moment(order?.updatedAt).format("HH:mm")}
            </span>
          </div>
        </>
      ),
      className: "centered-row",
    },
    ...(authUser?.role === "admin"
      ? [
          {
            title: "Seller Email",
            dataIndex: "seller.email",
            ...getColumnSearchProps("seller.email"),
            render: (_, record) => (
              <span style={{ textAlign: "center" }}>
                {record?.seller?.email}
              </span>
            ),
            className: "centered-row",
          },
        ]
      : []),
  ];

  const ndrOrders = dataSource?.filter(
    (order) =>
      order?.status === "UnDelivered" && order?.ndrstatus === "Required"
  );
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        <Popover
          placement="leftTop"
          title={
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Button onClick={() => showModal("Re-attempt")} loading={loading}>
                Re-attempt
              </Button>
              <Button onClick={() => handleAction("RTO")} loading={loading}>
                RTO
              </Button>
              <Button onClick={() => showModal("Reschedule")} loading={loading}>
                Reschedule
              </Button>
            </div>
          }
        >
          <Button
            type="primary"
            style={{ marginTop: "-1.5rem", padding: "15px", fontSize: "17px" }}
            icon={<MenuFoldOutlined style={{ marginTop: "0.5rem" }} />}
          >
            &nbsp; &nbsp; Action
          </Button>
        </Popover>
      </div>

      {/* <Modal
        title='Select Reschedule Date'
        open={isModalOpen}
        onOk={() => handleAction("Reschedule")}
        onCancel={handleModalCancel}
        okText='Confirm'
        cancelText='Cancel'
        confirmLoading={loading}
        okButtonProps={{ disabled: !selectedDate }}
        width={300}
      >
        <DatePicker onChange={handleDateChange} style={{ width: "100%" }} />
      </Modal> */}

      <Modal
        title={
          actionType === "Reschedule"
            ? "Select Reschedule Date"
            : "Enter Additional Address Notes"
        }
        open={isModalOpen}
        onOk={() => handleAction(actionType)} // 👈 use actionType
        onCancel={handleModalCancel}
        okText="Confirm"
        cancelText="Cancel"
        confirmLoading={loading}
        okButtonProps={{
          disabled:
            (actionType === "Reschedule" && !selectedDate) ||
            (actionType === "Re-attempt" && !additionalNotes.trim()),
        }}
        width={350}
      >
        {actionType === "Reschedule" ? (
          <DatePicker
            onChange={(date) => setSelectedDate(date)}
            style={{ width: "100%" }}
            showTime
            format="YYYY-MM-DDTHH:mm:ss"
          />
        ) : (
          <Input.TextArea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={4}
            placeholder="Enter additional address notes"
          />
        )}
      </Modal>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={ndrOrders}
        rowKey="_id"
        className="centered-table"
        scroll={{ x: 800 }}
        style={{ overflowX: "auto", marginTop: "-10px", padding: "0 10px" }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100", "500", "1000"],
          defaultPageSize: 10,
        }}
      />
    </div>
  );
};

export default ActionRequiredTab;
