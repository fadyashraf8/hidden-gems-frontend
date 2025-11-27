import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Upload, X, Image as ImageIcon, AlertTriangle, Star, User, Mail, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EditGem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_Base_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    gemLocation: '',
    description: '',
    category: '',
    status: 'pending',
    discount: 0,
    discountGold: 0,
    discountPlatinum: 0,
    isSubscribed: false
  });

  const [oldImages, setOldImages] = useState([]);
  
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  
  const [gemInfo, setGemInfo] = useState({
    avgRating: 0,
    createdBy: {},
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchGem();
    fetchCategories();
  }, [id]);

  const fetchGem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/gems/${id}`, {
        withCredentials: true
      });
      
      if (response.data.message === 'success') {
        const gem = response.data.result;
        
        setFormData({
          name: gem.name,
          gemLocation: gem.gemLocation,
          description: gem.description,
          category: gem.category._id,
          status: gem.status,
          discount: gem.discount,
          discountGold: gem.discountGold,
          discountPlatinum: gem.discountPlatinum,
          isSubscribed: gem.isSubscribed
        });
        
        setOldImages(gem.images || []);
        setGemInfo({
          avgRating: gem.avgRating,
          createdBy: gem.createdBy,
        });
      }
    } catch (error) {
      console.error('Error fetching gem:', error);
      toast.error('Failed to load gem data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = oldImages.length + newImages.length + files.length;
    
    if (totalImages > 10) {
      toast.error('Maximum 10 images allowed in total');
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
    
    setNewImages(prev => [...prev, ...validFiles]);
    
    const previews = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(previews).then(results => {
      setNewImagePreviews(prev => [...prev, ...results]);
    });
  };

  const removeOldImage = (index) => {
    setOldImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.gemLocation.trim()) {
      newErrors.gemLocation = 'Location is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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

    const totalImages = oldImages.length + newImages.length;
    if (totalImages === 0) {
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
      submitData.append('status', formData.status);
      submitData.append('discount', formData.discount);
      submitData.append('discountGold', formData.discountGold);
      submitData.append('discountPlatinum', formData.discountPlatinum);
      submitData.append('isSubscribed', formData.isSubscribed);
      
      oldImages.forEach(imageName => {
        submitData.append('oldImages[]', imageName);
      });
      
      newImages.forEach(imageFile => {
        submitData.append('images', imageFile);
      });

      let res =await axios.put(`${baseURL}/gems/${id}`, submitData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
console.log(res);

      toast.success('Gem updated successfully');
    //   setTimeout(() => {
    //     navigate('/admin/gems');
    //   }, 1500);
    } catch (error) {
      console.error('Error updating gem:', error);
      toast.error(error.response?.data?.message || 'Failed to update gem');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalImages = oldImages.length + newImages.length;

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
        <h1 className="text-3xl font-bold text-gray-900">Edit Hidden Gem</h1>
        <p className="text-gray-600 mt-2">Update gem information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Read-Only Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Images Management */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-600" />
                Images ({totalImages}/10)
              </h3>
            </div>

            {errors.images && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.images}</p>
              </div>
            )}
            
            {/* Old Images */}
            {oldImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Images</p>
                <div className="grid grid-cols-2 gap-3">
                  {oldImages.map((image, index) => (
                    <div key={`old-${index}`} className="relative group">
                      <img
                        src={`${baseURL}/uploads/gem/${image}`}
                        alt={`Gem ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeOldImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {newImagePreviews.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">New Images</p>
                <div className="grid grid-cols-2 gap-3">
                  {newImagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            {totalImages < 10 && (
              <label className="w-full block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImagesChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border-2 border-blue-200">
                  <Upload size={20} />
                  <span className="font-medium">Add More Images</span>
                </div>
              </label>
            )}
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Max 10 images total, 5MB each
            </p>
          </div>

          {/* Read-Only Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gem Statistics</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  Average Rating
                </span>
                <span className="font-semibold text-gray-900">
                  {gemInfo.avgRating.toFixed(1)} / 5.0
                </span>
              </div>
              
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Created By</span>
                </div>
                <p className="text-sm text-gray-900">
                  {gemInfo.createdBy.firstName} {gemInfo.createdBy.lastName}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Mail size={12} />
                  {gemInfo.createdBy.email}
                </p>
              </div>
            </div>
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
                  placeholder="Enter gem name"
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
                  placeholder="Enter detailed description"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Discounts & Subscription */}
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
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
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