import React, { useRef, useEffect, useState } from "react";
import { Modal, Input, Space, Switch, Button, Form, message } from "antd";
import { MapContainer, TileLayer, FeatureGroup, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { extractLatLngsFromPolygon } from "../../utils/coords";

// helper to convert Leaflet latlngs to GeoJSON polygon coords [[ [ [lng,lat], ... ] ]]
const toGeoJsonPolygonCoords = (latlngs) => {
  // latlngs is array of [lat,lng]
  const ring = latlngs.map(([lat, lng]) => [lng, lat]);
  // close ring if not closed
  if (ring.length && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
    ring.push(ring[0]);
  }
  return [[[ring]]]; // match the nested structure you provided in example
};

export default function ZoneEditorModal({ visible, onClose, onSubmit, initialZone }) {
  const [form] = Form.useForm();
  const [polygonLatLngs, setPolygonLatLngs] = useState([]);
  const featureGroupRef = useRef(null);

  useEffect(() => {
    if (initialZone) {
      form.setFieldsValue({
        name: initialZone.name,
        isActive: initialZone.isActive,
        shippingCost: initialZone.shippingCost,
      });
      const pts = extractLatLngsFromPolygon(initialZone.polygon);
      setPolygonLatLngs(pts);
    } else {
      form.resetFields();
      setPolygonLatLngs([]);
    }
  }, [initialZone, form, visible]);

  const handleCreated = (e) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0].map((p) => [p.lat, p.lng]);
    setPolygonLatLngs(latlngs);
  };

  const handleEdited = (e) => {
    // get first layer's latlngs
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const latlngs = layer.getLatLngs()[0].map((p) => [p.lat, p.lng]);
      setPolygonLatLngs(latlngs);
    });
  };

  const handleDeleted = () => {
    setPolygonLatLngs([]);
  };

  const submit = async () => {
    try {
      const values = await form.validateFields();
      if (!polygonLatLngs || polygonLatLngs.length < 3) {
        message.error("الرجاء رسم بوليغون مكون من 3 نقاط على الأقل.");
        return;
      }
      const body = {
        name: values.name,
        polygon: {
          type: "Polygon",
          coordinates: toGeoJsonPolygonCoords(polygonLatLngs),
        },
        isActive: !!values.isActive,
      };
      await onSubmit(body);
    } catch (err) {
      // validation errors handled by antd
    }
  };

  const center = polygonLatLngs.length ? polygonLatLngs[Math.floor(polygonLatLngs.length / 2)] : [30.8996, 28.8190];

  return (
    <Modal open={visible} onCancel={onClose} title={initialZone ? "Edit Zone" : "Add Zone"} footer={null} width={1000}>
      <Form layout="vertical" form={form}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="shippingCost" label="Shipping Cost">
          <Input />
        </Form.Item>

        <div style={{ height: 450, marginBottom: 12 }}>
          <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position="topright"
                onCreated={handleCreated}
                onEdited={handleEdited}
                onDeleted={handleDeleted}
                draw={{
                  rectangle: false,
                  polyline: false,
                  circle: false,
                  marker: false,
                  circlemarker: false,
                  polygon: {
                    allowIntersection: false,
                    showArea: true,
                  },
                }}
                edit={{
                  edit: true,
                  remove: true,
                }}
              />

              {/* render existing polygon if present */}
              {polygonLatLngs.length > 0 && <Polygon positions={polygonLatLngs} />}
            </FeatureGroup>
          </MapContainer>
        </div>

        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={submit}>
            {initialZone ? "Save" : "Add"}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}
