import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import './Features.css';
import { replaceContentAPI, saveProject } from '../../services/api';

const ReplaceContent = () => {
  const navigate = useNavigate();
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const [content, setContent] = useState('');
  const [contentFile, setContentFile] = useState(null);
  const [contentFileName, setContentFileName] = useState('');
  const [reference, setReference] = useState('');
  const [referenceFile, setReferenceFile] = useState(null);
  const [referenceFileName, setReferenceFileName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContentFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setContentFile(f);
      setContentFileName(f.name);
    }
  };

  const handleReferenceFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setReferenceFile(f);
      setReferenceFileName(f.name);
    }
  };

  const handleAnalyze = async () => {
    if ((!content && !contentFile) || loading) return;
    setLoading(true);

    try {
      // Send files + text to backend via FormData — backend extracts PDF/DOCX
      const data = await replaceContentAPI(content, reference, instructions, contentFile, referenceFile);
      setOutput(data.output || 'Error generating content. Please try again.');
      setAnalyzed(true);
    } catch (err) {
      setOutput('Error generating content. Please try again.');
      setAnalyzed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!output) return;
    const title = contentFileName || 'Replace Content Project';
    saveProject(title, output);
    alert('Project saved!');
  };

  return (
    <div className="feature-page-container">
      <div className="feature-left green-bg">
        <div className="feature-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={40} />
          </button>
          <h1>Replace Content</h1>
        </div>

        <div className="upload-section-wrapper">
          <div className="upload-section">
            <div className="input-box big">
              <textarea 
                placeholder={contentFileName ? `📎 ${contentFileName}` : "Copy Paste Your Content That Needs To be Replaced or upload the content"}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <input type="file" ref={fileInputRef1} style={{display: 'none'}} accept=".txt,.pdf,.docx" onChange={handleContentFileChange} />
              <button className="add-file-btn" onClick={() => fileInputRef1.current.click()}><Plus /></button>
            </div>

            <div className="input-box small">
              <input 
                type="text" 
                placeholder={referenceFileName ? `📎 ${referenceFileName}` : "Add Your Reference To Generate New Content"}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
              <input type="file" ref={fileInputRef2} style={{display: 'none'}} accept=".txt,.pdf,.docx" onChange={handleReferenceFileChange} />
              <button className="add-file-btn" onClick={() => fileInputRef2.current.click()}><Plus /></button>
            </div>

            <div className="input-box small">
              <input
                type="text"
                placeholder="Add any prompt or configurations you want"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <p className="feature-note">
              Note: Upload or copy - paste the report format or already made report. Our AI will analyze the report format 
              and generate new content for your particular report with same structure, headings and sub-headings of the 
              report you uploaded.
            </p>

            <button className="btn-primary analyze-btn" onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
      </div>

      <div className={`feature-right dark-bg ${analyzed ? 'analyzed' : ''}`}>
        <div className="preview-header">
          <h2>Preview</h2>
        </div>
        <div className="preview-box">
          {analyzed ? (
            <div className="analyzed-content">
              <p style={{whiteSpace: 'pre-wrap'}}>{output}</p>
              <p style={{fontSize: '0.75em', opacity: 0.5, marginTop: '12px'}}>Note: The generated content may not be fully accurate. Please review and verify before use.</p>
            </div>
          ) : (
            <p className="placeholder-text">The Content You Gave Before Replacing</p>
          )}
        </div>
        <div className="preview-actions">
          <button className="btn-outline" onClick={handleAnalyze}>Generate Again</button>
          <button className="btn-outline" onClick={handleSave}>Save</button>
          <button className="btn-outline">Export</button>
        </div>
      </div>
    </div>
  );
};

export default ReplaceContent;
