import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ProductsAdmin() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Estados do formulário
  const [form, setForm] = useState({ name: '', sku: '', category_id: '', price: '', gender: 'unissex' })
  const [images, setImages] = useState([])
  const [variants, setVariants] = useState([{ color: '', size: '', stock: 1 }])

  function load() {
    api.get('/admin/products', { params: { search } }).then((r) => setProducts(r.data.data))
  }

  useEffect(() => {
    load()
    api.get('/admin/categories').then((r) => setCategories(r.data))
  }, [search])

  async function remove(id) {
    if (!confirm('Remover este produto?')) return
    await api.delete(`/admin/products/${id}`)
    load()
  }

  // Funções para lidar com as variações dinâmicas
  function addVariant() {
    setVariants([...variants, { color: '', size: '', stock: 1 }])
  }

  function updateVariant(index, field, value) {
    const newVariants = [...variants]
    newVariants[index][field] = value
    setVariants(newVariants)
  }

  function removeVariant(index) {
    setVariants(variants.filter((_, i) => i !== index))
  }

  // Submissão do formulário
  async function submit(e) {
    e.preventDefault()
    const formData = new FormData()

    // 1. Dados básicos
    Object.keys(form).forEach(key => formData.append(key, form[key]))

    // 2. Imagens múltiplas
    Array.from(images).forEach((file, index) => {
      formData.append(`images[${index}]`, file)
    })

    // 3. Variações
    variants.forEach((v, index) => {
      formData.append(`variants[${index}][color]`, v.color)
      formData.append(`variants[${index}][size]`, v.size)
      formData.append(`variants[${index}][stock]`, v.stock)
    })

    try {
      await api.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setIsFormOpen(false)
      setForm({ name: '', sku: '', category_id: '', price: '', gender: 'unissex' })
      setImages([])
      setVariants([{ color: '', size: '', stock: 1 }])
      load()
    } catch (error) {
      alert('Erro ao salvar produto. Verifique os dados inseridos.')
      console.error(error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Produtos</h1>
        <div className="flex gap-2">
          <input placeholder="Buscar por nome ou SKU" value={search} onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-64" />
          <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-aqua text-white rounded-lg px-4 py-2 text-sm">
            {isFormOpen ? 'Cancelar' : '+ Novo Produto'}
          </button>
        </div>
      </div>

      {isFormOpen && (
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-sm mb-6 space-y-4">
          <h2 className="font-semibold text-lg">Cadastrar Novo Produto</h2>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Nome do Produto" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
            <input required placeholder="SKU" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
            
            <select required value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
              <option value="">Selecione a Categoria</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            
            <input required type="number" step="0.01" placeholder="Preço (R$)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
            
            <select required value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
              <option value="unissex">Unissex</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="infantil">Infantil</option>
            </select>
            
            <div className="col-span-2">
              <label className="block text-sm mb-1 text-neutral-600">Imagens do Produto</label>
              <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="border rounded-lg px-3 py-2 text-sm w-full" />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Variações (Cor, Tamanho, Estoque)</h3>
              <button type="button" onClick={addVariant} className="text-sm bg-neutral-800 text-white px-3 py-1 rounded-lg">+ Variação</button>
            </div>
            
            {variants.map((v, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input placeholder="Cor (ex: Preto)" value={v.color} onChange={e => updateVariant(index, 'color', e.target.value)} className="border rounded-lg px-3 py-2 text-sm flex-1" />
                <input placeholder="Tamanho (ex: M)" value={v.size} onChange={e => updateVariant(index, 'size', e.target.value)} className="border rounded-lg px-3 py-2 text-sm flex-1" />
                <input required type="number" min="0" placeholder="Estoque" value={v.stock} onChange={e => updateVariant(index, 'stock', e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-24" />
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(index)} className="text-red-500 text-sm px-2">Remover</button>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="w-full bg-aqua text-white rounded-lg py-3 font-medium">Salvar Produto</button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="p-3">Nome</th><th>SKU</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.category?.name}</td>
                <td>R$ {Number(p.price).toFixed(2)}</td>
                <td>{p.variants?.reduce((s, v) => s + v.stock, 0) ?? 0}</td>
                <td>{p.active ? 'Ativo' : 'Inativo'}</td>
                <td><button onClick={() => remove(p.id)} className="text-blush-dark text-xs">Excluir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
