import { useEffect, useState } from 'react';

const defaultForm = {
  name: '',
  category: 'ALIMENTO',
  price: '0',
  quantity: 0,
  photoUrl: '',
  description: ''
};

const ProductFormModal = ({ product, onClose, onSubmit }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity,
        photoUrl: product.photoUrl || '',
        description: product.description || ''
      });
    } else {
      setForm(defaultForm);
    }
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity)
    };
    onSubmit(payload);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header>
          <div>
            <p className="eyebrow">{product ? 'Editar produto' : 'Novo produto'}</p>
            <h2>{product ? product.name : 'Cadastre um item'}</h2>
          </div>
          <button className="ghost" onClick={onClose}>
            Fechar
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Categoria
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="ALIMENTO">Alimento</option>
              <option value="BEBIDA">Bebida</option>
              <option value="LIMPEZA">Limpeza</option>
              <option value="HIGIENE">Higiene</option>
              <option value="OUTRO">Outro</option>
            </select>
          </label>
          <label>
            Preço (R$)
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
          </label>
          <label>
            Quantidade
            <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} required />
          </label>
          <label>
            Foto (URL)
            <input name="photoUrl" value={form.photoUrl} onChange={handleChange} />
          </label>
          <label>
            Descrição
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>

          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
