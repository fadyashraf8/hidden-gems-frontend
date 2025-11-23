import React from "react";
import {
  Card,
  CardHeader,
  Avatar,
  Skeleton,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

export default function Media() {
  const [image, setImage] = React.useState(null);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [textLoading, setTextLoading] = React.useState(true); // Separate loading state for text if needed, or share

  const imageInputRef = React.useRef(null);
  const textInputRef = React.useRef(null);

  const handleImageClick = () => {
    imageInputRef.current.click();
  };

  const handleTextClick = () => {
    // When clicking skeleton or text, focus the hidden textarea
    // For better UX, we might want to show the textarea when editing
    textInputRef.current.style.display = "block";
    textInputRef.current.focus();
    setTextLoading(false); // Stop showing skeleton once clicked
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);
    setLoading(false); // Stop showing image skeleton
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextBlur = () => {
    // Hide textarea on blur if we want to switch back to text view
    // For this demo, let's keep it simple as per user request:
    // "if he its a a text skeleton he can input a skeleton" -> likely means input text
    if (text) {
      textInputRef.current.style.display = "none";
      setTextLoading(false);
    } else {
      // If empty, maybe show skeleton again? Or just placeholder?
      // Let's keep it editable
    }
  };

  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3 }}>
      <CardHeader
        avatar={<Avatar>A</Avatar>}
        title="Custom Card"
        subheader="User edited content"
      />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {/* IMAGE AREA */}
      {loading ? (
        <Skeleton
          sx={{ height: 190, cursor: "pointer" }}
          animation="wave"
          variant="rectangular"
          onClick={handleImageClick}
        />
      ) : (
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt="User uploaded"
          sx={{ cursor: "pointer", objectFit: "cover" }}
          onClick={handleImageClick}
        />
      )}

      <CardContent>
        {/* TEXT AREA */}

        {/* Text input (initially hidden) */}
        <textarea
          ref={textInputRef}
          value={text}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          placeholder="Type something..."
          style={{
            display: "none",
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />

        {textLoading && !text ? (
          <Skeleton
            animation="wave"
            height={20}
            width="80%"
            sx={{ cursor: "pointer" }}
            onClick={handleTextClick}
          />
        ) : (
          <Typography
            sx={{
              color: "text.secondary",
              cursor: "pointer",
              minHeight: "20px",
            }}
            onClick={handleTextClick}
            style={{
              display:
                textInputRef.current?.style.display === "block"
                  ? "none"
                  : "block",
            }}
          >
            {text || "Click to type text"}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
