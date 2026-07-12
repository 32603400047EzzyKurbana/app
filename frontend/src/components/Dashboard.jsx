import InstanceCard from "./InstanceCard.jsx";

export default function Dashboard({ instances, onAction, busyMap }) {
  if (instances.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">Tidak ada instance yang cocok</p>
        <p className="empty-state-body">Coba ubah kata kunci pencarian atau filter status di atas.</p>
      </div>
    );
  }

  return (
    <div className="instance-grid">
      {instances.map((instance) => (
        <InstanceCard
          key={instance.id}
          instance={instance}
          onAction={onAction}
          busyAction={busyMap[instance.id]}
        />
      ))}
    </div>
  );
}
