import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Skeleton,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import toast from "react-hot-toast";
import "./Owner.css";

export default function OwnerDashboard() {
  // Initialize with empty structure if nothing exists
  const [restaurant, setRestaurant] = useState({
    id: Date.now(),
    name: "",
    category: "",
    location: "",
    description: "",
    image: "",
  });

  // Track which fields are "loading" (showing skeleton)
  // If a field has data, it's not loading. If it's empty, it's loading (skeleton).
  const [loadingState, setLoadingState] = useState({
    image: true,
    name: true,
    category: true,
    location: true,
    description: true,
  });

  // Track which field is currently being edited (to show input instead of text/skeleton)
  const [editingField, setEditingField] = useState(null);

  const imageInputRef = useRef(null);

  useEffect(() => {
    const storedData = localStorage.getItem("ownerRestaurants");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      let data = null;
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        data = parsedData[0];
      } else if (!Array.isArray(parsedData) && parsedData.id) {
        data = parsedData;
      }

      if (data) {
        setRestaurant(data);
        // Update loading states based on data existence
        setLoadingState({
          image: !data.image,
          name: !data.name,
          category: !data.category,
          location: !data.location,
          description: !data.description,
        });
      }
    }
  }, []);

  const saveToStorage = (updatedRestaurant) => {
    const updatedData = [updatedRestaurant];
    localStorage.setItem("ownerRestaurants", JSON.stringify(updatedData));
    setRestaurant(updatedRestaurant);
  };

  const handleFieldChange = (field, value) => {
    const updated = { ...restaurant, [field]: value };
    saveToStorage(updated);

    // If value is not empty, stop loading state for this field
    if (value) {
      setLoadingState((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    handleFieldChange("image", url);
  };

  // Helper to render Interactive Skeleton Field
  const renderField = (field, label, variant = "text", component = null) => {
    const isSkeleton = loadingState[field] && !restaurant[field];
    const isEditing = editingField === field;

    if (isEditing) {
      // Render Input
      if (component) {
        return component; // Custom component like Select
      }
      return (
        <TextField
          fullWidth
          autoFocus
          multiline={field === "description"}
          variant="standard"
          value={restaurant[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          onBlur={() => {
            setEditingField(null);
            if (!restaurant[field])
              setLoadingState((prev) => ({ ...prev, [field]: true }));
          }}
          placeholder={`Enter ${label}`}
          InputProps={{
            disableUnderline: false,
            style: {
              fontSize: field === "name" ? "2rem" : "1rem",
              fontWeight: field === "name" ? "bold" : "normal",
            },
          }}
        />
      );
    }

    if (isSkeleton) {
      // Render Skeleton
      return (
        <Skeleton
          variant={variant}
          width={
            field === "description" ? "100%" : field === "name" ? "60%" : "40%"
          }
          height={field === "description" ? 100 : field === "name" ? 60 : 30}
          animation="wave"
          sx={{ cursor: "pointer", my: 1 }}
          onClick={() => setEditingField(field)}
        />
      );
    }

    // Render Value (Click to Edit)
    return (
      <Typography
        variant={field === "name" ? "h4" : "body1"}
        color={field === "location" ? "text.secondary" : "text.primary"}
        sx={{ cursor: "pointer", minHeight: "24px", display: "block" }}
        onClick={() => setEditingField(field)}
      >
        {field === "location" && "📍 "}
        {restaurant[field]}
      </Typography>
    );
  };

  return (
    <div className="owner-dashboard">
      <h1 className="owner-title">My Restaurant</h1>
      <p className="owner-subtitle">
        Tap on the skeletons to add your details.
      </p>

      <Card
        sx={{ maxWidth: 800, margin: "0 auto", boxShadow: 3, borderRadius: 2 }}
      >
        {/* IMAGE SECTION */}
        <Box
          sx={{
            position: "relative",
            height: 300,
            backgroundColor: "#f0f0f0",
            cursor: "pointer",
          }}
          onClick={() => imageInputRef.current.click()}
        >
          {loadingState.image && !restaurant.image ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
            />
          ) : (
            <img
              src={restaurant.image}
              alt={restaurant.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </Box>

        <CardContent sx={{ padding: 4 }}>
          {/* HEADER: NAME & CATEGORY */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Restaurant Name
              </Typography>
              {renderField("name", "Name", "text")}
            </Box>

            <Box sx={{ minWidth: 150 }}>
              <Typography variant="caption" color="text.secondary">
                Category
              </Typography>
              {renderField(
                "category",
                "Category",
                "rectangular",
                <FormControl variant="standard" fullWidth>
                  <Select
                    value={restaurant.category}
                    onChange={(e) => {
                      handleFieldChange("category", e.target.value);
                      setEditingField(null);
                    }}
                    onBlur={() => setEditingField(null)}
                    open={true} // Auto open when editing
                    disableUnderline
                  >
                    <MenuItem value="Egyptian">Egyptian</MenuItem>
                    <MenuItem value="Italian">Italian</MenuItem>
                    <MenuItem value="Syrian">Syrian</MenuItem>
                    <MenuItem value="Asian">Asian</MenuItem>
                    <MenuItem value="Cafe">Cafe</MenuItem>
                    <MenuItem value="Fast Food">Fast Food</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>

          {/* LOCATION */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Location
            </Typography>
            {renderField("location", "Location", "text")}
          </Box>

          {/* DESCRIPTION */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Description
            </Typography>
            {renderField("description", "Description", "rectangular")}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
