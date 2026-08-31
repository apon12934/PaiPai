const fs = require('fs');

let content = fs.readFileSync('src/components/settings/SettingsModal.jsx', 'utf8');

const oldUpload = `  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setProfileMsg({ text: 'Compressing and optimizing photo...', isError: false });`;

const newUpload = `  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Security constraints
    if (!file.type.startsWith('image/')) {
      setProfileMsg({ text: 'Invalid file type. Only images are allowed.', isError: true });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileMsg({ text: 'File too large. Maximum size is 5MB.', isError: true });
      return;
    }

    setIsUploadingPhoto(true);
    setProfileMsg({ text: 'Compressing and optimizing photo...', isError: false });`;

content = content.replace(oldUpload, newUpload);

fs.writeFileSync('src/components/settings/SettingsModal.jsx', content);
