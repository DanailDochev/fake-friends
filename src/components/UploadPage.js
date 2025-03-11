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
        
        <div className="file-upload-area">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".html"
            multiple
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            Choose Files
          </label>
          <p className="upload-help">
            Select the followers.html files from your Instagram data downloads
          </p>
        </div>
        
        {files.length > 0 && (
          <div className="uploaded-files">
            <h3>Uploaded Files ({files.length})</h3>
            <ul className="file-list">
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  <span>{file.name}</span>
                  <span className="file-date">
                    {new Date(file.lastModified).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="remove-file-btn"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={processFiles} 
              disabled={isProcessing || files.length < 2} 
              className="process-button"
            >
              {isProcessing ? 'Processing...' : 'Find Unfollowers'}
            </button>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
      </div>
      
      {unfollowers.length > 0 && (
        <div className="results-section">
          <h2>Unfollower Results</h2>
          
          {unfollowers.map((result, index) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadPage;