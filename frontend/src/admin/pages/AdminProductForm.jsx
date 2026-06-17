import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiPlus, FiX, FiUpload, FiLink } from 'react-icons/fi'

const CATEGORIES = ['watches', 'gadgets', 'accessories', 'fashion']

const empty = {
  name: '', description: '', price: '', originalPrice: '',
  category: 'watches', stock: '', images: [], tags: [],
  featured: false, isActive: true,
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [tagInput, setTagInput] = useState('')
  const [imageInput, setImageInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imageMode, setImageMode] = useState('file') // 'file' | 'url'
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isEdit) return
    api.get(`/products/${id}`)
      .then(({ data }) => {
        const p = data.product
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          originalPrice: p.originalPrice || '',
          category: p.category || 'watches',
          stock: p.stock || '',
          images: p.images || [],
          tags: p.tags || [],
          featured: p.featured || false,
          isActive: p.isActive !== false,
        })
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setFetching(false))
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const addImage = () => {
    if (!imageInput.trim()) return
    setForm((f) => ({ ...f, images: [...f.images, imageInput.trim()] }))
    setImageInput('')
  }

  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))

  const addTag = () => {
    if (!tagInput.trim()) return
    setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim().toLowerCase()] }))
    setTagInput('')
  }

  const removeTag = (i) => setForm((f) => ({ ...f, tags: f.tags.filter((_, idx) => idx !== i) }))

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const urls = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('image', file)
        const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        urls.push(data.url)
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }))
      toast.success(`${urls.length} image(s) uploaded`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.description || !form.stock) {
      return toast.error('Please fill all required fields')
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
      }
      if (isEdit) {
        await api.put(`/products/${id}`, payload)
        toast.success('Product updated')
      } else {
        await api.post('/products', payload)
        toast.success('Product created')
      }
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-gold-500 placeholder-white/20'

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/products')} className="text-white/40 hover:text-gold-500 transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <p className="text-white/30 text-xs tracking-widest uppercase mb-1">{isEdit ? 'Edit' : 'New'}</p>
          <h1 className="font-serif text-3xl text-white">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-black border border-white/10 p-6 space-y-5">
          <h3 className="text-white/40 text-xs tracking-widest uppercase pb-3 border-b border-white/10">Basic Information</h3>

          <div>
            <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Santos De Cartier" />
          </div>

          <div>
            <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
              className={`${inputClass} resize-none`} placeholder="Describe the product..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Category *</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-gold-500">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Stock *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className={inputClass} placeholder="0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Price (Rs.) *</label>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required className={inputClass} placeholder="2750" />
            </div>
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Original Price (Rs.)</label>
              <input name="originalPrice" type="number" min="0" value={form.originalPrice} onChange={handleChange} className={inputClass} placeholder="3500" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-black border border-white/10 p-6 space-y-4">
          <h3 className="text-white/40 text-xs tracking-widest uppercase pb-3 border-b border-white/10">Product Images</h3>

          {/* Mode toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setImageMode('file')}
              className={`flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 border transition-all ${
                imageMode === 'file' ? 'bg-gold-500 text-black border-gold-500' : 'border-white/10 text-white/40 hover:border-white/30'
              }`}
            >
              <FiUpload size={13} /> Upload from Device
            </button>
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 border transition-all ${
                imageMode === 'url' ? 'bg-gold-500 text-black border-gold-500' : 'border-white/10 text-white/40 hover:border-white/30'
              }`}
            >
              <FiLink size={13} /> Paste URL
            </button>
          </div>

          {/* File upload */}
          {imageMode === 'file' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="image-file-input"
              />
              <label
                htmlFor="image-file-input"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed cursor-pointer transition-all ${
                  uploading
                    ? 'border-gold-500/50 bg-gold-500/5'
                    : 'border-white/10 hover:border-gold-500/50 hover:bg-white/2'
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gold-500 text-xs tracking-widest uppercase">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/30">
                    <FiUpload size={24} />
                    <span className="text-xs tracking-widest uppercase">Click to select images</span>
                    <span className="text-[10px] text-white/20">JPG, PNG, WEBP up to 5MB each — multiple allowed</span>
                  </div>
                )}
              </label>
            </div>
          )}

          {/* URL input */}
          {imageMode === 'url' && (
            <div className="flex gap-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                className={`${inputClass} flex-1`}
                placeholder="https://images.unsplash.com/..."
              />
              <button type="button" onClick={addImage} className="btn-outline flex items-center gap-1 px-4">
                <FiPlus size={14} /> Add
              </button>
            </div>
          )}

          {/* Preview */}
          {form.images.length > 0 && (
            <div>
              <p className="text-white/20 text-[10px] tracking-widest uppercase mb-3">{form.images.length} image(s)</p>
              <div className="flex flex-wrap gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt=""
                      className="w-24 h-24 object-cover border border-white/10"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/96x96/111/444?text=?' }}
                    />
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-gold-500 text-black text-[9px] text-center py-0.5 tracking-widest uppercase">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tags & Options */}
        <div className="bg-black border border-white/10 p-6 space-y-5">
          <h3 className="text-white/40 text-xs tracking-widest uppercase pb-3 border-b border-white/10">Tags & Options</h3>

          <div>
            <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Tags</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className={`${inputClass} flex-1`}
                placeholder="luxury, watch, swiss..."
              />
              <button type="button" onClick={addTag} className="btn-outline px-4">Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 border border-white/10 text-white/50 text-xs px-3 py-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(i)} className="text-white/30 hover:text-red-400 ml-1">
                      <FiX size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="accent-yellow-500 w-4 h-4" />
              <span className="text-white/60 text-xs tracking-widest uppercase">Featured Product</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-yellow-500 w-4 h-4" />
              <span className="text-white/60 text-xs tracking-widest uppercase">Active (Visible)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
