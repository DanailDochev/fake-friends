import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UploadPage.css';

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unfollowers, setUnfollowers] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const parseFollowersList = (htmlContent) => {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Find all list items that contain followers
    const followerElements = doc.querySelectorAll('div._a6_q');
    
    const followers = [];
    
    // Extract follower usernames
    followerElements.forEach(element => {
      const usernameElement = element.querySelector('._a6_r');
      if (usernameElement) {
        followers.push(usernameElement.textContent.trim());
      }
    });
    
    return followers;
  };

  const findUnfollowers = (oldFollowers, newFollowers) => {
    return oldFollowers.filter(follower => !newFollowers.includes(follower));
  };

  const processFiles = async () => {
    if (files.length < 2) {
      setError('Please upload at least two followers list files to compare');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Read file contents
      const fileContents = await Promise.all(
        files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
              resolve({
                name: file.name,
                date: file.lastModified,
                content: e.target.result
              });
            };
            
            reader.onerror = reject;
            reader.readAsText(file);
          });
        })
      );

      // Sort by date (oldest first)
      fileContents.sort((a, b) => a.date - b.date);
      
      // Parse followers from each file
      const parsedData = fileContents.map(file => ({
        name: file.name,
        date: new Date(file.date).toLocaleDateString(),
        followers: parseFollowersList(file.content)
      }));
      
      // Find unfollowers between consecutive snapshots
      const unfollowerResults = [];
      
      for (let i = 0; i < parsedData.length - 1; i++) {
        const oldList = parsedData[i];
        const newList = parsedData[i + 1];
        
        const unfollowersList = findUnfollowers(oldList.followers, newList.followers);
        
        if (unfollowersList.length > 0) {
          unfollowerResults.push({
            oldDate: oldList.date,
            newDate: newList.date,
            unfollowers: unfollowersList
          });
        }
      }
      
      setUnfollowers(unfollowerResults);
    } catch (err) {
      console.error(err);
      setError('Error processing files. Make sure you uploaded valid Instagram followers HTML files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-section">
        <h1>Upload Follower Lists</h1>
        <p>Upload your Instagram followers HTML files to find who unfollowed you</p>
      </div>
      
      <div className="upload-areas-container">
        <div className="file-upload-area">
          <h3>Old Followers List</h3>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".html"
            className="file-input"
            id="file-input-old"
          />
          <label htmlFor="file-input-old" className="file-input-label">
            Choose Old File
          </label>
          {/* Show selected file name if exists */}
          {files[0] && <div className="selected-file">{files[0].name}</div>}
        </div>

        <div className="file-upload-area">
          <h3>New Followers List</h3>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".html"
            className="file-input"
            id="file-input-new"
          />
          <label htmlFor="file-input-new" className="file-input-label">
            Choose New File
          </label>
          {/* Show selected file name if exists */}
          {files[1] && <div className="selected-file">{files[1].name}</div>}
        </div>
      </div>

      <button 
        onClick={processFiles} 
        disabled={isProcessing || files.length < 2} 
        className="process-button"
      >
        {isProcessing ? 'Processing...' : 'Find Unfollowers'}
      </button>

      {error && <div className="error-message">{error}</div>}
      
      <div className="results-section">
        <h2>Unfollower Results</h2>
        {unfollowers.length > 0 ? (
          unfollowers.map((result, index) => (
            <div key={index} className="unfollower-group">
              <h3>Unfollowers between {result.oldDate} and {result.newDate}</h3>
              <div className="unfollower-list">
                {result.unfollowers.map((user, userIndex) => (
                  <div key={userIndex} className="unfollower-item">
                    <div className="unfollower-avatar">
                      {user.charAt(0).toUpperCase()}
                    </div>
                    <div className="unfollower-name">@{user}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">Upload and process your files to see unfollowers</p>
        )}
      </div>
    </div>
  );
}

export default UploadPage;