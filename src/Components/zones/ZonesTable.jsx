import React from "react";
import { Table, Button, Tag, Popconfirm, Switch } from "antd";

export default function ZonesTable({ zones, loading, onShowMap, onEdit, onDelete, onToggle }) {
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Shipping Cost",
      dataIndex: "shippingCost",
      key: "shippingCost",
      render: (v) => (v ? `${v} EGP` : "-"),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (v) => (v ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => onShowMap(record)}>Show on Map</Button>
          <Button onClick={() => onEdit(record)}>Edit</Button>

          <Popconfirm title="Delete this zone?" onConfirm={() => onDelete(record.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>

          <Switch checked={record.isActive} onChange={(checked) => onToggle(record.id, checked)} />
        </div>
      ),
    },
  ];

  return <Table rowKey="id" dataSource={zones} columns={columns} loading={loading} />;
}
