// import React, { useRef, useState } from 'react';
// import axios from 'axios';

// const CameraCapture = () => {
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }
//     } catch (err) {
//       console.error('Error accessing the camera:', err);
//       setError('Unable to access the camera. Please enable it.');
//     }
//   };

//   const captureImage = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const video = videoRef.current;
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//       // Convert to Blob
//       return new Promise((resolve) => {
//         canvas.toBlob((blob) => {
//           resolve(blob);
//         }, 'image/jpeg');
//       });
//     }
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (!email) {
//       setError('Email is required');
//       setLoading(false);
//       return;
//     }

//     const imageBlob = await captureImage();
//     if (!imageBlob) {
//       setError('Failed to capture image. Please try again.');
//       setLoading(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('file', new File([imageBlob], 'captured-image.jpg', { type: 'image/jpeg' }));
//     const config = {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     };
//     try {
//       console.log(formData.get('email'));
//       const response = await axios.post('http://localhost:8000/api/camera/verify', formData,config);
//       if (response.data.success) {
//         alert('Verification successful!');
//       } else {
//         setError('Verification failed.');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('An error occurred during verification.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <h2>Camera Capture and Upload</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <div style={{ position: 'relative', width: '640px', height: '480px', marginBottom: '20px' }}>
//         <video ref={videoRef} style={{ width: '100%', height: '100%', border: '1px solid #ccc' }} />
//         <canvas ref={canvasRef} style={{ display: 'none' }} />
//       </div>

//       <button onClick={startCamera}>Start Camera</button>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter your email"
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Verifying...' : 'Verify'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CameraCapture;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CameraCapture = () => {
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !image) {
      setError('Please provide both email and an image.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', image);

    try {
      const response = await axios.post('http://localhost:8000/api/camera/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setLoading(false);
      console.log(response.data);
      if (response.data.success) {
        alert('Verification successful!');
        navigate('/home'); // Replace with the route for the next page
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during verification. Please try again.');
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '400px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '10px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Verification Form</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default CameraCapture;
