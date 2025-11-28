import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function AddCategory() {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_Base_URL;

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    categoryName: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }
    if (!imageFile) {
      newErrors.categoryImage = 'Category image is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix all errors', 'error');
      return;
    }

    setSaving(true);

    const submitData = new FormData();
    submitData.append('categoryName', formData.categoryName);
    if (imageFile) submitData.append('categoryImage', imageFile);

    axios.post(`${baseURL}/categories`, submitData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      showToast('Category created successfully', 'success');
      console.log(res);
      
      // navigate('/admin/categories');
    })
    .catch(err => {
      console.error('Error creating category:', err);
      showToast(err.response?.data?.message || 'Failed to create category', 'error');
    })
    .finally(() => setSaving(false));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/admin/categories" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
        <p className="text-gray-600 mt-2">Create a new category</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Image</h3>
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Category" className="w-32 h-32 rounded-lg object-cover border-4 border-gray-200" />
                    <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <Upload size={48} className="text-gray-400" />
                  </div>
                )}
              </div>

              <label className="w-full">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border-2 border-blue-200">
                  <Upload size={18} />
                  <span className="font-medium">Upload Image</span>
                </div>
              </label>
              {errors.categoryImage && <p className="text-red-500 text-xs mt-1">{errors.categoryImage}</p>}
              <p className="text-xs text-gray-500 mt-3 text-center">Max size: 5MB. Format: JPG, PNG, GIF</p>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.categoryName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter category name"
              />
              {errors.categoryName && <p className="text-red-500 text-xs mt-1">{errors.categoryName}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="button" onClick={handleSubmit} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Create Category
                </>
              )}
            </button>
            
            <Link to="/admin/categories" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Cancel
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span>{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: '', type: '' })} className="hover:opacity-80 transition-opacity">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
