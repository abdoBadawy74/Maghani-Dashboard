import React, { useRef, useEffect, useState } from "react";
import { Modal, Input, Space, Switch, Button, Form, message } from "antd";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import { extractLatLngsFromPolygon } from "../../utils/coords";

// 🌟 تحويل إحداثيات Leaflet إلى الشكل المطلوب للسيرفر (4 مستويات)
/**
 * تحويل إحداثيات Leaflet لأي nested array إلى الشكل المطلوب من السيرفر
 */
export const toGeoJsonPolygonCoords = (leafletLatLngs) => {
  if (!leafletLatLngs || !Array.isArray(leafletLatLngs)) return [];

  // flatten كل المستويات لزوجات [lat, lng]
  const flattenLatLngs = (arr) => {
    if (Array.isArray(arr[0]) && typeof arr[0][0] === "number") {
      return arr; // وصلنا لزوج [lat, lng]
    }
    return flattenLatLngs(arr[0]);
  };

  const latlngs = flattenLatLngs(leafletLatLngs);

  if (latlngs.length < 3) return [];

  // تحويل لـ [lng, lat]
  const ring = latlngs.map(([lat, lng]) => [lng, lat]);

  // تأكد من إغلاق الحلقة
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push(first);
  }

  // غلاف 4 مستويات array كما السيرفر يريد
  return [[[[...ring]]]];
};


export default function ZoneEditorModal({ visible, onClose, onSubmit, initialZone }) {
  const [form] = Form.useForm();
  const [polygonLatLngs, setPolygonLatLngs] = useState([]);
  const featureGroupRef = useRef(null);
  const mapRef = useRef(null);
  const defaultCenter = [30.033333, 31.233334];

  // 🌟 تهيئة المودال والخريطة
  useEffect(() => {
    const featureGroup = featureGroupRef.current;
    let pts = [];

    if (featureGroup) featureGroup.clearLayers();

    if (initialZone) {
      form.setFieldsValue({
        name: initialZone.name,
        isActive: initialZone.isActive,
        shippingCost: initialZone.shippingCost,
      });

      pts = extractLatLngsFromPolygon(initialZone.polygon);
      setPolygonLatLngs(pts);

      if (pts.length >= 3 && featureGroup) {
        const polygonLayer = L.polygon(pts);
        const fg = featureGroup.leafletElement || featureGroup;
        fg.addLayer(polygonLayer);
        if (polygonLayer.editing) polygonLayer.editing.enable();
      }
    } else {
      form.resetFields();
      setPolygonLatLngs([]);
    }

    if (visible) {
      setTimeout(() => {
        const map = mapRef.current;
        if (map) {
          map.invalidateSize();
          map.setView(
            pts.length ? pts[Math.floor(pts.length / 2)] : defaultCenter,
            13
          );
        }
      }, 150);
    }
  }, [initialZone, visible]);

  const center =
    polygonLatLngs.length
      ? polygonLatLngs[Math.floor(polygonLatLngs.length / 2)]
      : defaultCenter;

  // 🌟 إدارة إنشاء البوليغون على الخريطة
  const handleCreated = (e) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0].map((p) => [p.lat, p.lng]);
    setPolygonLatLngs(latlngs);

    featureGroupRef.current.clearLayers();
    featureGroupRef.current.addLayer(layer);
  };

  // 🌟 تعديل البوليغون
  const handleEdited = (e) => {
    e.layers.eachLayer((layer) => {
      const latlngs = layer.getLatLngs()[0].map((p) => [p.lat, p.lng]);
      setPolygonLatLngs(latlngs);
    });
  };

  // 🌟 حذف البوليغون
  const handleDeleted = () => setPolygonLatLngs([]);

  // 🌟 إرسال البيانات للسيرفر
  const submit = async () => {
    try {
      const values = await form.validateFields();

      if (!polygonLatLngs || polygonLatLngs.length < 3) {
        message.error("Please draw a polygon with at least 3 points.");
        return;
      }

      const body = {
        "name": values.name,
        "polygon": {
          "type": "Polygon",
          "coordinates": [
            [
              toGeoJsonPolygonCoords(polygonLatLngs)[0][0][0]

            ]
          ]
        },
        "isActive": true,
        // "shippingCost": parseInt(values.shippingCost) || 0

      }

      await onSubmit(body);
    } catch (err) { }
  };


  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={initialZone ? "Edit Zone" : "Add Zone"}
      footer={null}
      width={1000}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="shippingCost" label="Shipping Cost" rules={[{ required: true }]}>
          <Input type="number" step="0.01" />
        </Form.Item>

        <div style={{ height: 450, marginBottom: 12 }}>
          <MapContainer
            key={initialZone ? initialZone.id : "add"}
            ref={mapRef}
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
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
                  polygon: { allowIntersection: false, showArea: true },
                }}
              />
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
