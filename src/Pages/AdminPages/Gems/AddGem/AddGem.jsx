import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Upload, X, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AddGem() {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_Base_URL;

  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    gemLocation: '',
    description: '',
    category: '',
    discount: 0,
    discountGold: 0,
    discountPlatinum: 0,
    isSubscribed: false
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/categories`, {
        withCredentials: true
      });
      if (response.data.message === 'success') {
        setCategories(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + files.length;
    
    if (totalImages > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    
    const validFiles = [];
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return;
      }
      validFiles.push(file);
    });
    
    setImages(prev => [...prev, ...validFiles]);
    
    const previews = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(previews).then(results => {
      setImagePreviews(prev => [...prev, ...results]);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.gemLocation.trim()) {
      newErrors.gemLocation = 'Location is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.discount < 0 || formData.discount > 100) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }
    
    if (formData.discountGold < 0 || formData.discountGold > 100) {
      newErrors.discountGold = 'Gold discount must be between 0 and 100';
    }
    
    if (formData.discountPlatinum < 0 || formData.discountPlatinum > 100) {
      newErrors.discountPlatinum = 'Platinum discount must be between 0 and 100';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all errors');
      return;
    }

    try {
      setSaving(true);
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('gemLocation', formData.gemLocation);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('discount', formData.discount);
      submitData.append('discountGold', formData.discountGold);
      submitData.append('discountPlatinum', formData.discountPlatinum);
      submitData.append('isSubscribed', formData.isSubscribed);
      
      images.forEach(image => {
        submitData.append('images', image);
      });

      const response = await axios.post(`${baseURL}/gems`, submitData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(response.data.message || 'Gem created successfully');
      setTimeout(() => {
        navigate('/admin/gems');
      }, 1500);
    } catch (error) {
      console.error('Error creating gem:', error);
      toast.error(error.response?.data?.message || 'Failed to create gem');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/gems"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Gems
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add Hidden Gem</h1>
        <p className="text-gray-600 mt-2">Create a new hidden gem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-600" />
              Images ({images.length}/10) <span className="text-red-500">*</span>
            </h3>

            {errors.images && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {errors.images}
                </p>
              </div>
            )}
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 10 && (
              <label className="w-full block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border-2 border-blue-200">
                  <Upload size={20} />
                  <span className="font-medium">
                    {images.length === 0 ? 'Upload Images' : 'Add More Images'}
                  </span>
                </div>
              </label>
            )}
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Required: At least 1 image
              <br />
              Max: 10 images, 5MB each
              <br />
              Format: JPG, PNG, GIF
            </p>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-600" />
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gem Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter gem name (min 3 characters)"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="gemLocation"
                    value={formData.gemLocation}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.gemLocation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter location"
                  />
                </div>
                {errors.gemLocation && (
                  <p className="text-red-500 text-xs mt-1">{errors.gemLocation}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter detailed description (min 10 characters)"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Discounts & Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Tier Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.discount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.discount && (
                  <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gold Tier Discount (%)
                </label>
                <input
                  type="number"
                  name="discountGold"
                  value={formData.discountGold}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.discountGold ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.discountGold && (
                  <p className="text-red-500 text-xs mt-1">{errors.discountGold}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platinum Tier Discount (%)
                </label>
                <input
                  type="number"
                  name="discountPlatinum"
                  value={formData.discountPlatinum}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.discountPlatinum ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.discountPlatinum && (
                  <p className="text-red-500 text-xs mt-1">{errors.discountPlatinum}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isSubscribed"
                  checked={formData.isSubscribed}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Subscription Active
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Create Gem
                </>
              )}
            </button>
            
            <Link
              to="/admin/gems"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}