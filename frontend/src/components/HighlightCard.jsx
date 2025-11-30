import { FaMapMarkerAlt } from 'react-icons/fa';

const HighlightCard = () => (
  <section className="highlight-card">
    <div>
      <img src="/logo.svg" alt="Carrinho" style={{ width: '72px' }} />
    </div>
    <div>
      <span>Venha conhecer</span>
      <h3>
        Mercadinho <br /> do Povo
      </h3>
      <p>
        <FaMapMarkerAlt style={{ marginRight: '6px' }} />
        Próximo ao Raimundo da Água
      </p>
    </div>
  </section>
);

export default HighlightCard;
