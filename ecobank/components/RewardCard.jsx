// Presenter: kartu satu hadiah
export default function RewardCard({ reward, saldo, onSelect }) {
  const kurang = reward.biaya - saldo;
  const cukup = kurang <= 0;

  return (
    <article className="reward">
      <h3>{reward.nama}</h3>
      <p className="muted">{reward.deskripsi}</p>
      <div className="reward-foot">
        <div>
          <strong>{reward.biaya.toLocaleString("id-ID")} poin</strong>
          {!cukup && <div className="muted small">Kurang {kurang} poin</div>}
        </div>
        <button className="btn" disabled={!cukup} onClick={() => onSelect(reward)}>
          Tukar
        </button>
      </div>
    </article>
  );
}
