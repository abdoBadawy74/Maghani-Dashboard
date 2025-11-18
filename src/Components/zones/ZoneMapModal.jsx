import React from "react";
import { Modal } from "antd";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import { extractLatLngsFromPolygon } from "../../utils/coords";

// المكون المضاف حديثاً (قم بنقله إلى هنا أو استيراده)
import { useMap } from "react-leaflet"; // تأكد من استيراد useMap
import { useEffect } from "react";

function MapResizer({ visible }) {
  const map = useMap();
  
  useEffect(() => {
    if (visible) {
      // تأخير بسيط لضمان انتهاء ظهور الـ Modal
      // قد تحتاج إلى زيادة قيمة التأخير إذا لم ينجح 0
      setTimeout(() => {
        map.invalidateSize(); 
      }, 100); 
    }
  }, [visible, map]);

  return null;
}
// --- نهاية المكون الإضافي ---

export default function ZoneMapModal({ visible, onClose, zone }) {
  if (!zone) return null;
  const latlngs = extractLatLngsFromPolygon(zone.polygon);

  const center = latlngs.length ? latlngs[Math.floor(latlngs.length / 2)] : [0, 0];

  return (
    <Modal open={visible} footer={null} onCancel={onClose} width={900} title={zone.name}>
      <div style={{ height: 500 }}>
        {/* إضافة prop key لـ MapContainer للمساعدة في إعادة التهيئه عند تغيير zone */}
        <MapContainer 
          key={zone.id} // مفتاح لإعادة تهيئة الخريطة عند تغيير المنطقة
          center={center} 
          zoom={13} 
          style={{ height: "100%", width: "100%" }}
        >
          {/* إضافة MapResizer هنا */}
          <MapResizer visible={visible} /> 

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {latlngs.length > 0 && <Polygon positions={latlngs} />}
        </MapContainer>
      </div>
    </Modal>
  );
}